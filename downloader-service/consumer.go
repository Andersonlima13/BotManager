package main

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

const approvedQueue = "approved"

type RabbitMQConsumer struct {
	conn       *amqp.Connection
	channel    *amqp.Channel
	downloader *VideoDownloader
	workers    int
}

func NewRabbitMQConsumer(url string, downloader *VideoDownloader, workers int) (*RabbitMQConsumer, error) {
	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("erro ao criar channel: %w", err)
	}

	_, err = ch.QueueDeclare(approvedQueue, true, false, false, false, nil)
	if err != nil {
		return nil, fmt.Errorf("erro ao declarar fila: %w", err)
	}

	// equivalente ao prefetch — quantas msgs entrega de uma vez
	ch.Qos(workers, 0, false)

	return &RabbitMQConsumer{
		conn:       conn,
		channel:    ch,
		downloader: downloader,
		workers:    workers,
	}, nil
}

func (c *RabbitMQConsumer) Start() error {
	msgs, err := c.channel.Consume(approvedQueue, "", false, false, false, false, nil)
	if err != nil {
		return fmt.Errorf("erro ao consumir fila: %w", err)
	}

	log.Printf("Aguardando vídeos na fila '%s' com %d workers...\n", approvedQueue, c.workers)

	// semáforo — limita goroutines simultâneas
	sem := make(chan struct{}, c.workers)

	for msg := range msgs {
		sem <- struct{}{} // ocupa uma vaga

		go func(m amqp.Delivery) {
			defer func() { <-sem }() // libera a vaga ao terminar

			video, err := ParseVideo(m.Body)
			if err != nil {
				log.Println("Erro ao parsear mensagem:", err)
				m.Nack(false, false) // descarta — JSON inválido não tem conserto
				return
			}

			if err := c.downloader.Download(video); err != nil {
				log.Printf("Erro no download de %s: %v\n", video.ID, err)
				m.Nack(false, true) // devolve pra fila — pode ser falha temporária de rede
				return
			}

			m.Ack(false)
		}(msg)
	}

	return nil
}

func (c *RabbitMQConsumer) Close() {
	c.channel.Close()
	c.conn.Close()
}

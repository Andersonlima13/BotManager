package main

import (
	"log"
	"os"
)

func main() {
	rabbitmqURL := os.Getenv("RABBITMQ_URL")
	if rabbitmqURL == "" {
		rabbitmqURL = "amqp://guest:guest@localhost:5672/"
	}

	downloader := NewVideoDownloader("./downloads")
	if err := downloader.EnsureDir(); err != nil {
		log.Fatal("Erro ao criar diretório:", err)
	}

	// ajusta o número de workers pela variável de ambiente
	workers := 5
	consumer, err := NewRabbitMQConsumer(rabbitmqURL, downloader, workers)
	if err != nil {
		log.Fatal(err)
	}
	defer consumer.Close()

	if err := consumer.Start(); err != nil {
		log.Fatal(err)
	}
}
package main

import (
	"encoding/json"
	"fmt"
)

type Media struct {
	URL string `json:"url"`
}

type Video struct {
	ID      json.Number `json:"id"` // ← aceita número sem perder precisão
	Caption string      `json:"caption"`
	Media   Media       `json:"media"`
}

func ParseVideo(data []byte) (*Video, error) {
	// usa decoder com UseNumber para não converter floats automaticamente
	var raw struct {
		ID      json.Number `json:"id"`
		Caption string      `json:"caption"`
		Media   struct {
			URL string `json:"url"`
		} `json:"media"`
	}

	if err := json.Unmarshal(data, &raw); err != nil {
		return nil, fmt.Errorf("erro ao parsear JSON: %w", err)
	}

	return &Video{
		ID:      raw.ID,
		Caption: raw.Caption,
		Media:   Media{URL: raw.Media.URL},
	}, nil
}

// retorna o ID como string limpa para usar no nome do arquivo
func (v *Video) StringID() string {
	return v.ID.String()
}

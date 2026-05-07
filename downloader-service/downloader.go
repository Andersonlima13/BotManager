package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

type VideoDownloader struct {
	outputDir string
}

func NewVideoDownloader(dir string) *VideoDownloader {
	return &VideoDownloader{outputDir: dir}
}

func (d *VideoDownloader) EnsureDir() error {
	return os.MkdirAll(d.outputDir, os.ModePerm)
}

func (d *VideoDownloader) Download(video *Video) error {
	fmt.Printf("Baixando: %s - %s\n", video.StringID(), video.Caption)

	resp, err := http.Get(video.Media.URL)
	if err != nil {
		return fmt.Errorf("erro na requisição: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("status inesperado: %d", resp.StatusCode)
	}

	filePath := filepath.Join(d.outputDir, video.StringID()+".mp4") // ← StringID()
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("erro ao criar arquivo: %w", err)
	}
	defer file.Close()

	_, err = io.Copy(file, resp.Body)
	if err != nil {
		os.Remove(filePath)
		return fmt.Errorf("erro ao gravar arquivo: %w", err)
	}

	fmt.Printf("Salvo: %s\n", filePath)
	return nil
}

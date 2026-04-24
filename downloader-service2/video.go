package main

import "encoding/json"

type Media struct {
	URL string `json:"url"`
}

type Video struct {
	ID      string `json:"id"`
	Caption string `json:"caption"`
	Media   Media  `json:"media"`
}

func ParseVideo(data []byte) (*Video, error) {
	var v Video
	if err := json.Unmarshal(data, &v); err != nil {
		return nil, err
	}
	return &v, nil
}
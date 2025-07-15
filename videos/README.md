# Videos Folder

## Como adicionar o teu vídeo

1. **Coloca o teu vídeo nesta pasta** com o nome `chatbot-demo.mp4`
2. **Formatos suportados**: MP4, WebM
3. **Tamanho recomendado**: Máximo 50MB para melhor performance no Netlify

## Estrutura dos ficheiros

```
videos/
├── chatbot-demo.mp4    (obrigatório)
├── chatbot-demo.webm   (opcional, para melhor compatibilidade)
```

## Dicas para otimizar o vídeo

### Compressão
- Usa H.264 para MP4
- Resolução recomendada: 1080p ou 720p
- Bitrate: 1-3 Mbps para boa qualidade

### Ferramentas online gratuitas
- **HandBrake**: https://handbrake.fr/
- **Online Video Converter**: https://www.onlinevideoconverter.com/
- **Clipchamp**: https://clipchamp.com/

### Comandos FFmpeg (se tiveres instalado)
```bash
# Para comprimir o vídeo
ffmpeg -i input.mp4 -crf 23 -preset medium -c:v libx264 -c:a aac chatbot-demo.mp4

# Para criar versão WebM
ffmpeg -i chatbot-demo.mp4 -c:v libvpx-vp9 -c:a libvorbis chatbot-demo.webm
```

## Funcionalidades

- ✅ Reprodução automática com controlos
- ✅ Poster/thumbnail (imagem de preview)
- ✅ Fallback para imagem se o vídeo não carregar
- ✅ Responsive (adapta-se ao tamanho do ecrã)
- ✅ Funciona no Netlify

## Netlify Deploy

O Netlify suporta vídeos até 100MB por ficheiro. Para vídeos maiores:
1. Usa um serviço como YouTube ou Vimeo
2. Incorpora o vídeo usando iframe
3. Ou divide o vídeo em partes menores 
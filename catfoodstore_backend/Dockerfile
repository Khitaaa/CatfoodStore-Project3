# ============================
# 1) Build Stage
# ============================
FROM golang:1.25.4 AS builder

WORKDIR /app

# โหลด dependency
COPY go.mod go.sum ./
RUN go mod download

# คัดลอก source code ทั้งหมด
COPY . .

# Build binary (static)
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go


# ============================
# 2) Runtime Stage
# ============================
FROM alpine:latest

WORKDIR /root

# คัดลอก binary ที่ build แล้ว
COPY --from=builder /app/main .

# ⭐ คัดลอกไฟล์ .env เข้า container (สำคัญมาก)
COPY .env .

# เผื่อ alpine ไม่มี CA certificates (บางครั้ง DB TLS จะ error)
RUN apk add --no-cache ca-certificates

# Expose port สำหรับ docker compose
EXPOSE 8080

CMD ["./main"]

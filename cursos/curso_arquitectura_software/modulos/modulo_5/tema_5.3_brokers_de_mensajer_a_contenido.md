# Tema 5.3: Brokers de Mensajería (RabbitMQ, Kafka)

**Tiempo estimado**: 40 minutos  
**Nivel**: Avanzado

## RabbitMQ vs Kafka

| Aspecto | RabbitMQ | Kafka |
|---------|----------|-------|
| Tipo | Message Broker | Event Streaming Platform |
| Modelo | Push (broker envía a consumers) | Pull (consumers leen) |
| Persistencia | Opcional | Siempre persistente |
| Orden | Por cola | Por partición |
| Uso | Task queues, RPC | Event streaming, logs |

---

## RabbitMQ

```python
import pika
import json

class RabbitMQProducer:
    """Producer para RabbitMQ."""
    def __init__(self, host='localhost'):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host)
        )
        self.channel = self.connection.channel()
    
    def publish(self, queue: str, message: dict):
        """Publicar mensaje."""
        self.channel.queue_declare(queue=queue, durable=True)
        
        self.channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=json.dumps(message),
            properties=pika.BasicProperties(delivery_mode=2)
        )

class RabbitMQConsumer:
    """Consumer para RabbitMQ."""
    def __init__(self, host='localhost'):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host)
        )
        self.channel = self.connection.channel()
    
    def consume(self, queue: str, callback):
        """Consumir mensajes."""
        self.channel.queue_declare(queue=queue, durable=True)
        
        def wrapper(ch, method, properties, body):
            message = json.loads(body)
            callback(message)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        
        self.channel.basic_consume(queue=queue, on_message_callback=wrapper)
        self.channel.start_consuming()
```

---

## Kafka

```python
from kafka import KafkaProducer, KafkaConsumer
import json

class KafkaEventProducer:
    """Producer para Kafka."""
    def __init__(self, bootstrap_servers='localhost:9092'):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    
    def publish(self, topic: str, event: dict):
        """Publicar evento."""
        self.producer.send(topic, event)
        self.producer.flush()

class KafkaEventConsumer:
    """Consumer para Kafka."""
    def __init__(self, topic: str, group_id: str, bootstrap_servers='localhost:9092'):
        self.consumer = KafkaConsumer(
            topic,
            group_id=group_id,
            bootstrap_servers=bootstrap_servers,
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
    
    def consume(self, callback):
        """Consumir eventos."""
        for message in self.consumer:
            callback(message.value)
```

---

## Resumen

**RabbitMQ**: Message broker tradicional, ideal para task queues
**Kafka**: Event streaming platform, ideal para event sourcing y logs

**Siguiente paso**: Tema 5.4 - Diseño de Contratos

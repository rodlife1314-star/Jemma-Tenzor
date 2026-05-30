# Pathfinder v0.1 - Compact Serverless CPU Runtime Image
FROM python:3.10-slim AS runner

LABEL maintainer="rodlife1314@gmail.com"
LABEL target="Pathfinder CPU Production Environment"

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

WORKDIR /octagon-app

# Sync and install minimal standard dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir -r requirements.txt

# Copy gateway and deploy scripts into live runtime location
RUN mkdir -p /octagon-app/engine
COPY ./src/jemma_tenzor/inference/gateway.py /octagon-app/inference.py
COPY ./deploy/entrypoint.sh /octagon-app/entrypoint.sh
RUN chmod +x /octagon-app/entrypoint.sh

# Expose standard port for serverless platforms (Cloud Run defaults to 8080)
EXPOSE 8080

ENTRYPOINT ["/octagon-app/entrypoint.sh"]
CMD ["serve"]

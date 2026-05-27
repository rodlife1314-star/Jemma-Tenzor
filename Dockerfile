# Stage 1: Build-time compilation & dependency resolution of TensorRT-LLM
FROM nvidia/cuda:12.4.1-devel-ubuntu22.04 AS builder

LABEL maintainer="rodlife1314@gmail.com"
LABEL target="TensorRT-LLM Build Environment"

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install build dependencies and compilation tools
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir --upgrade pip

# Isolate wheels for runtime copying
WORKDIR /build
RUN pip3 download --dest /build/wheels \
    tensorrt_llm==0.10.0 --extra-index-url https://pypi.nvidia.com

RUN pip3 download --dest /build/wheels \
    fastapi \
    uvicorn \
    pydantic \
    transformers \
    numpy

# Stage 2: Clean Serverless GPU Runtime Environment
FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04 AS runner

LABEL maintainer="rodlife1314@gmail.com"
LABEL target="TensorRT-LLM GPU Production Environment"

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV LD_LIBRARY_PATH="/usr/local/cuda/lib64:${LD_LIBRARY_PATH}"

# Install minimal standard system runtimes
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    curl \
    libnvinfer10 \
    libnvinfer-plugin10 \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir --upgrade pip

# Import pre-resolved binaries and execute local offline installation
COPY --from=builder /build/wheels /tmp/wheels
RUN pip3 install --no-cache-dir --no-index --find-links=/tmp/wheels \
    tensorrt_llm==0.10.0 \
    fastapi \
    uvicorn \
    pydantic \
    transformers \
    numpy && \
    rm -rf /tmp/wheels

WORKDIR /octagon-app

# Copy compiled engine workspace and scripts into live scope
COPY ./trt-engine /octagon-app/engine
COPY ./inference.py /octagon-app/inference.py
COPY ./deploy/entrypoint.sh /octagon-app/entrypoint.sh
RUN chmod +x /octagon-app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/octagon-app/entrypoint.sh"]
CMD ["serve"]

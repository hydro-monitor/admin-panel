.PHONY: all panel

IMAGE_NAME=$(if $(ENV_IMAGE_NAME),$(ENV_IMAGE_NAME),hydro-monitor/admin-panel)
IMAGE_VERSION=$(if $(ENV_IMAGE_VERSION),$(ENV_IMAGE_VERSION),v0.0.0)

$(info panel image settings: $(IMAGE_NAME) version $(IMAGE_VERSION))

all: panel

test:
	npm test

panel:
	npm start

image-panel:
	docker build -t $(IMAGE_NAME):$(IMAGE_VERSION) -f deploy/Dockerfile .

run-image-panel: image-panel
	docker run -p 3000:3000 -d $(IMAGE_NAME):$(IMAGE_VERSION)

push-image-panel: image-panel
	docker push $(IMAGE_NAME):$(IMAGE_VERSION)
.PHONY: deploy
deploy:
	cd pages && uv run mkdocs gh-deploy -b master

.PHONY: serve
serve:
	cd pages && uv run mkdocs serve

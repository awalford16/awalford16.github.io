.PHONY: deploy
deploy:
	uv run mkdocs gh-deploy -b master

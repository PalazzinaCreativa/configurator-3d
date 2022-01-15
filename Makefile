publish:
	yarn build; \
	yarn build:types; \
	git add .; \
	git commit -m "$(MESSAGE)"; \
	git push -u origin main; \
	npm version patch; \
	npm publish; \


npm-publish:
	yarn build; \
	yarn build:types; \
	npm version patch; \
	git add .; \
	git commit -m "new patch"; \
	git push -u origin main; \
	npm publish; \

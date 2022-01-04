publish:
	npm version patch; \
	yarn build; \
	yarn build:types; \
	git add .; \
	git commit -m "new patch"; \
	git push -u origin main; \
	npm publish; \


publish:
	npm i; \
	npm run build; \
	npm run build:types; \
	git stash; \
	npm version patch; \
	git stash pop; \
	git add .; \
	git commit -m "$(MESSAGE)"; \
	git push -u origin main; \
	npm publish; \


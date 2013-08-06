REPORTER = spec
test:
	./node_modules/.bin/mocha --reporter $(REPORTER) && \
	./node_modules/.bin/grunt

patch:
	./node_modules/.bin/mocha --reporter $(REPORTER) && \
	./node_modules/.bin/grunt patch

minor:
	./node_modules/.bin/mocha --reporter $(REPORTER) && \
	./node_modules/.bin/grunt minor

major:
	./node_modules/.bin/mocha --reporter $(REPORTER) && \
	./node_modules/.bin/grunt major

.PHONY: test
.PHONY: patch
.PHONY: minor
.PHONY: major
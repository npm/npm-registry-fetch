# Changelog

## [19.1.0](https://github.com/npm/npm-registry-fetch/compare/v19.0.0...v19.1.0) (2025-10-28)
### Features
* [`d8074d6`](https://github.com/npm/npm-registry-fetch/commit/d8074d6a0344085180e0acc37d1ebeb789c7de63) [#280](https://github.com/npm/npm-registry-fetch/pull/280) add signal opt (#280) (@clemgbld)

## [19.0.0](https://github.com/npm/npm-registry-fetch/compare/v18.0.2...v19.0.0) (2025-07-24)
### ⚠️ BREAKING CHANGES
* `npm-registry-fetch` now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`364c6c0`](https://github.com/npm/npm-registry-fetch/commit/364c6c0278b81d106239ba1d1a0f51b96d4aa53d) [#277](https://github.com/npm/npm-registry-fetch/pull/277) align to npm 11 node engine range (@owlstronaut)
### Dependencies
* [`a94aa45`](https://github.com/npm/npm-registry-fetch/commit/a94aa458bdac7ef117c731580fe5775397c43ed0) [#277](https://github.com/npm/npm-registry-fetch/pull/277) `npm-package-arg@13.0.0`
* [`743188b`](https://github.com/npm/npm-registry-fetch/commit/743188bf301d854d1cebdc8079b22f106374b038) [#277](https://github.com/npm/npm-registry-fetch/pull/277) `make-fetch-happen@15.0.0`
### Chores
* [`563fda6`](https://github.com/npm/npm-registry-fetch/commit/563fda6a01433bbcf60fce30f30f5961fd85c39f) [#277](https://github.com/npm/npm-registry-fetch/pull/277) `cacache@20.0.0` (@owlstronaut)
* [`d5519d6`](https://github.com/npm/npm-registry-fetch/commit/d5519d64377a159a855f963922927fba8b5ad838) [#277](https://github.com/npm/npm-registry-fetch/pull/277) template-oss apply fix (@owlstronaut)
* [`894f3a7`](https://github.com/npm/npm-registry-fetch/commit/894f3a7f22f73d9246c3591d171f1c3cec40e3ee) [#277](https://github.com/npm/npm-registry-fetch/pull/277) `@npmcli/template-oss@4.25.0` (@owlstronaut)

## [18.0.2](https://github.com/npm/npm-registry-fetch/compare/v18.0.1...v18.0.2) (2024-10-16)
### Bug Fixes
* [`8044781`](https://github.com/npm/npm-registry-fetch/commit/80447811a5d532e917488917eea6e5b10267d843) [#273](https://github.com/npm/npm-registry-fetch/pull/273) log cache hits distinct from fetch (#273) (@mbtools)
### Chores
* [`99b99d2`](https://github.com/npm/npm-registry-fetch/commit/99b99d2971724518152c1121d6a672ffff111885) [#269](https://github.com/npm/npm-registry-fetch/pull/269) bump cacache from 18.0.4 to 19.0.1 (#269) (@dependabot[bot])
* [`bd3f7d1`](https://github.com/npm/npm-registry-fetch/commit/bd3f7d1be56a884086a84a5a96194313c0ed0065) [#272](https://github.com/npm/npm-registry-fetch/pull/272) bump @npmcli/template-oss from 4.23.3 to 4.23.4 (#272) (@dependabot[bot], @npm-cli-bot)

## [18.0.1](https://github.com/npm/npm-registry-fetch/compare/v18.0.0...v18.0.1) (2024-10-02)
### Dependencies
* [`ad9139a`](https://github.com/npm/npm-registry-fetch/commit/ad9139a8638f85ab159ba6733fae6fe763083204) [#270](https://github.com/npm/npm-registry-fetch/pull/270) bump `make-fetch-happen@14.0.0`

## [18.0.0](https://github.com/npm/npm-registry-fetch/compare/v17.1.0...v18.0.0) (2024-09-26)
### ⚠️ BREAKING CHANGES
* `npm-registry-fetch` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`93d71a6`](https://github.com/npm/npm-registry-fetch/commit/93d71a6cb45e5622f0dad0ecb039b7d160045194) [#264](https://github.com/npm/npm-registry-fetch/pull/264) align to npm 10 node engine range (@reggi)
### Dependencies
* [`78aa620`](https://github.com/npm/npm-registry-fetch/commit/78aa620415a40978f78a92a8c2f2a07593c8afcc) [#266](https://github.com/npm/npm-registry-fetch/pull/266) bump minizlib from 2.1.2 to 3.0.1 (#266)
* [`842f324`](https://github.com/npm/npm-registry-fetch/commit/842f324b7f0045b4ade9c9ee2033bcd38d9a5f71) [#264](https://github.com/npm/npm-registry-fetch/pull/264) `proc-log@5.0.0`
* [`b394f34`](https://github.com/npm/npm-registry-fetch/commit/b394f34ba2e1ba062614ef7c8bdefac6355a659a) [#264](https://github.com/npm/npm-registry-fetch/pull/264) `npm-package-arg@12.0.0`
* [`c2b986a`](https://github.com/npm/npm-registry-fetch/commit/c2b986a20ffa4a0c36ac0c5e5096a41cf91a9387) [#264](https://github.com/npm/npm-registry-fetch/pull/264) `minipass-fetch@4.0.0`
* [`351e1f4`](https://github.com/npm/npm-registry-fetch/commit/351e1f42371de69bac3e560595f62b14d28a8e28) [#264](https://github.com/npm/npm-registry-fetch/pull/264) `@npmcli/redact@3.0.0`
### Chores
* [`bd5f617`](https://github.com/npm/npm-registry-fetch/commit/bd5f61742fe304c0e366131108337e68711fe4a2) [#262](https://github.com/npm/npm-registry-fetch/pull/262) bump ssri from 10.0.6 to 12.0.0 (#262) (@dependabot[bot])
* [`60a396a`](https://github.com/npm/npm-registry-fetch/commit/60a396a095e08d72bd56190d3a31e3e0d63f575e) [#264](https://github.com/npm/npm-registry-fetch/pull/264) run template-oss-apply (@reggi)
* [`0a9f05b`](https://github.com/npm/npm-registry-fetch/commit/0a9f05be03a8410edffbbf3dc121a930c21535ac) [#256](https://github.com/npm/npm-registry-fetch/pull/256) bump @npmcli/eslint-config from 4.0.5 to 5.0.0 (@dependabot[bot])
* [`4317115`](https://github.com/npm/npm-registry-fetch/commit/4317115fe040d701121c65bc57a053caafcafb8b) [#257](https://github.com/npm/npm-registry-fetch/pull/257) postinstall for dependabot template-oss PR (@hashtagchris)
* [`81080b9`](https://github.com/npm/npm-registry-fetch/commit/81080b9f53cc4dea3aeab2b38396527756011902) [#257](https://github.com/npm/npm-registry-fetch/pull/257) bump @npmcli/template-oss from 4.23.1 to 4.23.3 (@dependabot[bot])

## [17.1.0](https://github.com/npm/npm-registry-fetch/compare/v17.0.1...v17.1.0) (2024-06-12)

### Features

* [`29712af`](https://github.com/npm/npm-registry-fetch/commit/29712af1ff756d652313710c0c54a82961a0d038) [#246](https://github.com/npm/npm-registry-fetch/pull/246) merging functionality from minipass-json-stream (@wraithgar)

### Dependencies

* [`9a3e7e8`](https://github.com/npm/npm-registry-fetch/commit/9a3e7e8f1644028685e97d27412592a215799afd) [#246](https://github.com/npm/npm-registry-fetch/pull/246) remove minipass-json-stream
* [`089d0f9`](https://github.com/npm/npm-registry-fetch/commit/089d0f9749fa42a4ecb56e6d5cfdbc7b51dbf817) [#246](https://github.com/npm/npm-registry-fetch/pull/246) add `jsonparse@1.3.1`

### Chores

* [`920a3d8`](https://github.com/npm/npm-registry-fetch/commit/920a3d843fc16938b4430a1619f3d5cf41f8bac9) [#241](https://github.com/npm/npm-registry-fetch/pull/241) bump @npmcli/template-oss to 4.22.0 (@lukekarrys)
* [`17a1013`](https://github.com/npm/npm-registry-fetch/commit/17a10133f95f4ee163c281cd5c1e1ffc2b9a109c) [#241](https://github.com/npm/npm-registry-fetch/pull/241) postinstall for dependabot template-oss PR (@lukekarrys)

## [17.0.1](https://github.com/npm/npm-registry-fetch/compare/v17.0.0...v17.0.1) (2024-05-02)

### Bug Fixes

* [`45cef0a`](https://github.com/npm/npm-registry-fetch/commit/45cef0a7c4c1dfa7fc3c78ef3807029065bcf45b) [#239](https://github.com/npm/npm-registry-fetch/pull/239) allow HttpErrorBase to take headers object (@lukekarrys, @wraithgar)
* [`45cef0a`](https://github.com/npm/npm-registry-fetch/commit/45cef0a7c4c1dfa7fc3c78ef3807029065bcf45b) [#239](https://github.com/npm/npm-registry-fetch/pull/239) make ErrorBase always capture stack trace (#239) (@lukekarrys, @wraithgar)

## [17.0.0](https://github.com/npm/npm-registry-fetch/compare/v16.2.1...v17.0.0) (2024-04-30)

### ⚠️ BREAKING CHANGES

* remove undcoumented cleanUrl export (#234)

### Features

* [`105f786`](https://github.com/npm/npm-registry-fetch/commit/105f7865bf0da8bdb2e29dffa92c0fc2e93debc5) [#234](https://github.com/npm/npm-registry-fetch/pull/234) remove undcoumented cleanUrl export (#234) (@lukekarrys)

### Dependencies

* [`7cc481b`](https://github.com/npm/npm-registry-fetch/commit/7cc481b8763ac60dc3fea7e14870a36f74e3b4d2) [#238](https://github.com/npm/npm-registry-fetch/pull/238) `@npmcli/redact@2.0.0`

### Chores

* [`bdc9039`](https://github.com/npm/npm-registry-fetch/commit/bdc9039538a07cb6d7f64873fa5ee1ba638e4c8f) [#238](https://github.com/npm/npm-registry-fetch/pull/238) fix linting in test files (@wraithgar)
* [`ceaf77e`](https://github.com/npm/npm-registry-fetch/commit/ceaf77ece4eb71a4ab1f9542bf4e75aec0dd4b05) [#236](https://github.com/npm/npm-registry-fetch/pull/236) postinstall for dependabot template-oss PR (@lukekarrys)
* [`377d981`](https://github.com/npm/npm-registry-fetch/commit/377d981cb6165adec1a9b96627c1431604400a68) [#236](https://github.com/npm/npm-registry-fetch/pull/236) bump @npmcli/template-oss from 4.21.3 to 4.21.4 (@dependabot[bot])

## [16.2.1](https://github.com/npm/npm-registry-fetch/compare/v16.2.0...v16.2.1) (2024-04-12)

### Dependencies

* [`7a18f69`](https://github.com/npm/npm-registry-fetch/commit/7a18f69e303a680b991fa225fbe3800c9222fd8c) [#232](https://github.com/npm/npm-registry-fetch/pull/232) `proc-log@4.0.0` (#232)

## [16.2.0](https://github.com/npm/npm-registry-fetch/compare/v16.1.0...v16.2.0) (2024-04-03)

### Features

* [`76b02e8`](https://github.com/npm/npm-registry-fetch/commit/76b02e8356a49c81d4fff32a1470778ccabf8477) [#231](https://github.com/npm/npm-registry-fetch/pull/231) use @npmcli/redact for url cleaning (#231) (@lukekarrys)

### Chores

* [`e58e8bc`](https://github.com/npm/npm-registry-fetch/commit/e58e8bc6c5b25d53a764f58190fc3a5c764a2e78) [#225](https://github.com/npm/npm-registry-fetch/pull/225) postinstall for dependabot template-oss PR (@lukekarrys)
* [`ac8ae30`](https://github.com/npm/npm-registry-fetch/commit/ac8ae309a436fa075bd8526d8e39ed017b41067f) [#225](https://github.com/npm/npm-registry-fetch/pull/225) bump @npmcli/template-oss from 4.21.1 to 4.21.3 (@dependabot[bot])
* [`8fc28d0`](https://github.com/npm/npm-registry-fetch/commit/8fc28d0722fcf05feda4847bcb3ba8825d3cb51a) [#222](https://github.com/npm/npm-registry-fetch/pull/222) postinstall for dependabot template-oss PR (@lukekarrys)
* [`b7c4309`](https://github.com/npm/npm-registry-fetch/commit/b7c43093733ff53deb27f99f9c6fc736a8b33bbd) [#222](https://github.com/npm/npm-registry-fetch/pull/222) bump @npmcli/template-oss from 4.19.0 to 4.21.1 (@dependabot[bot])

## [16.1.0](https://github.com/npm/npm-registry-fetch/compare/v16.0.0...v16.1.0) (2023-10-10)

### Features

* [`84823a5`](https://github.com/npm/npm-registry-fetch/commit/84823a5c85b010f62d9a9f3b890fdee0d1d6f80a) [#212](https://github.com/npm/npm-registry-fetch/pull/212) include regKey and authKey in auth object (@wraithgar)
* [`92ec0da`](https://github.com/npm/npm-registry-fetch/commit/92ec0dacb20af1b32ae5f07cf59440ade21b25e7) [#212](https://github.com/npm/npm-registry-fetch/pull/212) add getAuth to main exports (@wraithgar)

## [16.0.0](https://github.com/npm/npm-registry-fetch/compare/v15.0.0...v16.0.0) (2023-08-15)

### ⚠️ BREAKING CHANGES

* support for node <=16.13 has been removed

### Bug Fixes

* [`4c0be5e`](https://github.com/npm/npm-registry-fetch/commit/4c0be5ea200fd48994fb0a39f19d451fde8a9b30) [#199](https://github.com/npm/npm-registry-fetch/pull/199) drop node 16.13.x support (@lukekarrys)

### Dependencies

* [`c859195`](https://github.com/npm/npm-registry-fetch/commit/c8591951477b66149bb0663b3e26d054a3bafcef) [#197](https://github.com/npm/npm-registry-fetch/pull/197) bump npm-package-arg from 10.1.0 to 11.0.0
* [`c1d490d`](https://github.com/npm/npm-registry-fetch/commit/c1d490dd63a2268aa17adc14420278ceb1468e0e) [#198](https://github.com/npm/npm-registry-fetch/pull/198) bump make-fetch-happen from 12.0.0 to 13.0.0

## [15.0.0](https://github.com/npm/npm-registry-fetch/compare/v14.0.5...v15.0.0) (2023-07-28)

### ⚠️ BREAKING CHANGES

* the underlying fetch module now uses `@npmcli/agent`. Backwards compatibility should be fully implemented but due to the scope of this change it was made a breaking change out of an abundance of caution.
* support for node 14 has been removed

### Bug Fixes

* [`b875c26`](https://github.com/npm/npm-registry-fetch/commit/b875c269f35da1a878c3dc353d622a07c3257c7c) [#193](https://github.com/npm/npm-registry-fetch/pull/193) drop node14 support (#193) (@wraithgar)

### Dependencies

* [`a97564f`](https://github.com/npm/npm-registry-fetch/commit/a97564fac4fc1f8ff76b325906583c8d4d207eb3) [#195](https://github.com/npm/npm-registry-fetch/pull/195) bump make-fetch-happen from 11.1.1 to 12.0.0 (#195)
* [`e154d49`](https://github.com/npm/npm-registry-fetch/commit/e154d4918aa16495d01bdd7232221d2ae87d3c3d) [#191](https://github.com/npm/npm-registry-fetch/pull/191) bump minipass from 5.0.0 to 7.0.2

## [14.0.5](https://github.com/npm/npm-registry-fetch/compare/v14.0.4...v14.0.5) (2023-04-27)

### Dependencies

* [`a2d5880`](https://github.com/npm/npm-registry-fetch/commit/a2d5880ba09bfdf1ec67aed0bca1a68e5db9786c) [#177](https://github.com/npm/npm-registry-fetch/pull/177) bump minipass from 4.2.7 to 5.0.0 (#177)

## [14.0.4](https://github.com/npm/npm-registry-fetch/compare/v14.0.3...v14.0.4) (2023-04-13)

### Bug Fixes

* [`15dd221`](https://github.com/npm/npm-registry-fetch/commit/15dd2216a52393fbce2246c071045c6597c922ea) [#178](https://github.com/npm/npm-registry-fetch/pull/178) clean password by using url object itself (#178) (@DEMON1A)

### Documentation

* [`14d1159`](https://github.com/npm/npm-registry-fetch/commit/14d11597d499882aba36403300b128bee19a8b53) [#173](https://github.com/npm/npm-registry-fetch/pull/173) update API documentation of noProxy option (#173) (@lingyuncai)

## [14.0.3](https://github.com/npm/npm-registry-fetch/compare/v14.0.2...v14.0.3) (2022-12-07)

### Dependencies

* [`c669335`](https://github.com/npm/npm-registry-fetch/commit/c669335c163439d7b860967154249713f51253d8) [#158](https://github.com/npm/npm-registry-fetch/pull/158) bump minipass from 3.3.6 to 4.0.0

## [14.0.2](https://github.com/npm/npm-registry-fetch/compare/v14.0.1...v14.0.2) (2022-10-18)

### Dependencies

* [`36b7685`](https://github.com/npm/npm-registry-fetch/commit/36b768515b37af9e1dac22c5ef211f64e279461e) [#154](https://github.com/npm/npm-registry-fetch/pull/154) bump npm-package-arg from 9.1.2 to 10.0.0

## [14.0.1](https://github.com/npm/npm-registry-fetch/compare/v14.0.0...v14.0.1) (2022-10-17)

### Dependencies

* [`ade1c8b`](https://github.com/npm/npm-registry-fetch/commit/ade1c8b03ee694e6dc4025805cb3d59eca768c43) [#150](https://github.com/npm/npm-registry-fetch/pull/150) bump minipass-fetch from 2.1.2 to 3.0.0
* [`84bb850`](https://github.com/npm/npm-registry-fetch/commit/84bb850f63af899d471f7761cdb2cb17c53e3784) [#149](https://github.com/npm/npm-registry-fetch/pull/149) bump proc-log from 2.0.1 to 3.0.0

## [14.0.0](https://github.com/npm/npm-registry-fetch/compare/v13.3.1...v14.0.0) (2022-10-13)

### ⚠️ BREAKING CHANGES

* this module no longer attempts to change file ownership automatically
* `npm-registry-fetch` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

* [`104a51f`](https://github.com/npm/npm-registry-fetch/commit/104a51f869dd97e3decca389f742c920f29687d0) [#138](https://github.com/npm/npm-registry-fetch/pull/138) postinstall for dependabot template-oss PR (@lukekarrys)

### Dependencies

* [`b5aeed0`](https://github.com/npm/npm-registry-fetch/commit/b5aeed0cb4e639b6460fb1419f0bb86eb45ddcb3) [#146](https://github.com/npm/npm-registry-fetch/pull/146) bump make-fetch-happen from 10.2.1 to 11.0.0 (#146)

## [13.3.1](https://github.com/npm/npm-registry-fetch/compare/v13.3.0...v13.3.1) (2022-08-15)


### Bug Fixes

* linting ([c9a8727](https://github.com/npm/npm-registry-fetch/commit/c9a8727f026367a86c50d103035f1c02d89431fd))

## [13.3.0](https://github.com/npm/npm-registry-fetch/compare/v13.2.0...v13.3.0) (2022-07-18)


### Features

* respect registry-scoped certfile and keyfile options ([#125](https://github.com/npm/npm-registry-fetch/issues/125)) ([42d605c](https://github.com/npm/npm-registry-fetch/commit/42d605cb00986c6775e6ec1732b114e065266ae9))

## [13.2.0](https://github.com/npm/npm-registry-fetch/compare/v13.1.1...v13.2.0) (2022-06-29)


### Features

* set 'npm-auth-type' header depending on config option ([#123](https://github.com/npm/npm-registry-fetch/issues/123)) ([ff4ed65](https://github.com/npm/npm-registry-fetch/commit/ff4ed65b04127dea40c1ebce741ac91088deaf1a))

### [13.1.1](https://github.com/npm/npm-registry-fetch/compare/v13.1.0...v13.1.1) (2022-04-13)


### Bug Fixes

* replace deprecated String.prototype.substr() ([#115](https://github.com/npm/npm-registry-fetch/issues/115)) ([804411f](https://github.com/npm/npm-registry-fetch/commit/804411f345be9737e5edadffb0e686bc7263ce1d))

## [13.1.0](https://www.github.com/npm/npm-registry-fetch/compare/v13.0.1...v13.1.0) (2022-03-22)


### Features

* clean token from logged urls ([#107](https://www.github.com/npm/npm-registry-fetch/issues/107)) ([9894911](https://www.github.com/npm/npm-registry-fetch/commit/989491178115ad3bb898b7c681ab6cad4293e8f2))


### Dependencies

* update make-fetch-happen requirement from ^10.0.3 to ^10.0.4 ([#96](https://www.github.com/npm/npm-registry-fetch/issues/96)) ([38d9782](https://www.github.com/npm/npm-registry-fetch/commit/38d978297c1f1183da1b1c55f3ea9e670a9934d3))
* update make-fetch-happen requirement from ^10.0.4 to ^10.0.6 ([#101](https://www.github.com/npm/npm-registry-fetch/issues/101)) ([1d2f3ed](https://www.github.com/npm/npm-registry-fetch/commit/1d2f3edec1a0399ba046df8662cc1097da2be434))
* update minipass-fetch requirement from ^2.0.1 to ^2.0.2 ([#95](https://www.github.com/npm/npm-registry-fetch/issues/95)) ([d8c3180](https://www.github.com/npm/npm-registry-fetch/commit/d8c3180d0b8a584a9024b4b6f9a34cb00a9e8523))
* update minipass-fetch requirement from ^2.0.2 to ^2.0.3 ([#99](https://www.github.com/npm/npm-registry-fetch/issues/99)) ([3e08986](https://www.github.com/npm/npm-registry-fetch/commit/3e08986b4283f88719a2c92f058177a3123f81e4))
* update npm-package-arg requirement from ^9.0.0 to ^9.0.1 ([#102](https://www.github.com/npm/npm-registry-fetch/issues/102)) ([a6192b4](https://www.github.com/npm/npm-registry-fetch/commit/a6192b48b2dc95f488cf479e448ff97fc1bc5d4a))

### [13.0.1](https://www.github.com/npm/npm-registry-fetch/compare/v13.0.0...v13.0.1) (2022-03-02)


### Dependencies

* bump minipass-fetch from 1.4.1 to 2.0.1 ([#92](https://www.github.com/npm/npm-registry-fetch/issues/92)) ([33d0ecd](https://www.github.com/npm/npm-registry-fetch/commit/33d0ecd411e4af03db2a2adf8db2f21ea72e2c42))
* update make-fetch-happen requirement from ^10.0.2 to ^10.0.3 ([ee38552](https://www.github.com/npm/npm-registry-fetch/commit/ee38552b304eafd706b8a67093f1904c57ca1af3))

## [13.0.0](https://www.github.com/npm/npm-registry-fetch/compare/v12.0.2...v13.0.0) (2022-02-14)


### ⚠ BREAKING CHANGES

* this drops support for passing in a `log` property. All logs are now emitted on the process object via `proc-log`

### Features

* use proc-log and drop npmlog support ([#85](https://www.github.com/npm/npm-registry-fetch/issues/85)) ([db90766](https://www.github.com/npm/npm-registry-fetch/commit/db907663bcde5871dc99840a7dab5358a8fc410e))


### Dependencies

* bump npm-package-arg from 8.1.5 to 9.0.0 ([0b41730](https://www.github.com/npm/npm-registry-fetch/commit/0b41730bc55e82180d369b8a4a7a198c16f26d34))
* update make-fetch-happen requirement from ^10.0.1 to ^10.0.2 ([6644733](https://www.github.com/npm/npm-registry-fetch/commit/6644733199ab7569d2452174b9a467193b7171a8))

### [12.0.2](https://www.github.com/npm/npm-registry-fetch/compare/v12.0.1...v12.0.2) (2022-02-09)


### Bug Fixes

* consistent use of url.URL ([847e5f9](https://www.github.com/npm/npm-registry-fetch/commit/847e5f93cc3c468ed1fdecfd00aba5ef1fa37b16))


### Dependencies

* update make-fetch-happen requirement from ^10.0.0 to ^10.0.1 ([d1a2a7f](https://www.github.com/npm/npm-registry-fetch/commit/d1a2a7f72af3650879e5bfc7c094830eaa59181c))
* update minipass requirement from ^3.1.3 to ^3.1.6 ([caa4309](https://www.github.com/npm/npm-registry-fetch/commit/caa43093d382be9a54a9e22c5f1ab8fa834f0612))
* update minipass-fetch requirement from ^1.3.0 to ^1.4.1 ([52f2ca9](https://www.github.com/npm/npm-registry-fetch/commit/52f2ca98b79969f9ba19df38bf1aee79c04518e6))
* update minizlib requirement from ^2.0.0 to ^2.1.2 ([9258e8a](https://www.github.com/npm/npm-registry-fetch/commit/9258e8a06fd9458c22584cf267b2d4d18751659a))
* update npm-package-arg requirement from ^8.0.0 to ^8.1.5 ([131ab16](https://www.github.com/npm/npm-registry-fetch/commit/131ab16408867e987e144d1267dee086c5fa8507))


### Documentation

* rename token to _authToken ([d615b4e](https://www.github.com/npm/npm-registry-fetch/commit/d615b4e6cf284c4a8f39b24700beacbf07dfec5d))

### [12.0.1](https://www.github.com/npm/npm-registry-fetch/compare/v12.0.0...v12.0.1) (2022-01-25)


### dependencies

* @npmcli/template-oss@2.5.1 ([cc4cc11](https://www.github.com/npm/npm-registry-fetch/commit/cc4cc11050a3b0e35f6bc59f5dd49a957f7a0569))
* make-fetch-happen@10.0.0 ([6926dd1](https://www.github.com/npm/npm-registry-fetch/commit/6926dd1270b6c1292cf9adb25429db77755ff5d6))

### [12.0.0](https://github.com/npm/registry-fetch/compare/v11.0.0...v12.0.0) (2021-11-23)

### ⚠ BREAKING CHANGES

* feat(opts): use scope instead of projectScope
* drop support for node10 and non-LTS versions of node12 and node14

### [11.0.0](https://github.com/npm/registry-fetch/compare/v10.1.2...v11.0.0)

### ⚠ BREAKING CHANGES

* remove handling of deprecated warning headers (#53)

### Features

* better cache status (#54)

### Bug Fixes

* docs: fix header typo for npm-command (#51)
* fix(docs): update registry param (#52)

### [10.1.2](https://github.com/npm/registry-fetch/compare/v10.1.1...v10.1.2)

### Bug Fixes

* fix: get auth token correct when login with sso

### [10.1.1](https://github.com/npm/registry-fetch/compare/v10.1.0...v10.1.1)

### Bug Fixes

* Send auth when hostname matches registry, and reg has auth

### [10.1.1](https://github.com/npm/registry-fetch/compare/v10.0.0...v10.1.0)

### Features

* feat(auth): set basicAuth (#45)

### [10.0.0](https://github.com/npm/registry-fetch/compare/v9.0.0...v10.0.0)

### ⚠ BREAKING CHANGES

* feat(auth) load/send based on URI, not registry

### Features:

* feat(otp): Adds opts.otpPrompt to provide an OTP on demand

### Bug Fixes

* fix(config): remove isFromCI and npm-is-ci

### [9.0.0](https://github.com/npm/registry-fetch/compare/v8.1.4...v9.0.0)

### ⚠ BREAKING CHANGES

* Remove publishConfig option

### [8.1.5](https://github.com/npm/registry-fetch/compare/v8.1.4...v8.1.5) (2020-10-12)


### Bug Fixes

* respect publishConfig.registry when specified ([32e36ef](https://github.com/npm/registry-fetch/commit/32e36efe86302ed319973cd5b1e6ccc3f62e557e)), closes [#35](https://github.com/npm/registry-fetch/issues/35)

### [8.1.4](https://github.com/npm/registry-fetch/compare/v8.1.3...v8.1.4) (2020-08-17)


### Bug Fixes

* redact passwords from http logs ([3c294eb](https://github.com/npm/registry-fetch/commit/3c294ebbd7821725db4ff1bc5fe368c49613efcc))

### [8.1.3](https://github.com/npm/registry-fetch/compare/v8.1.2...v8.1.3) (2020-07-21)

### [8.1.2](https://github.com/npm/registry-fetch/compare/v8.1.1...v8.1.2) (2020-07-11)

### [8.1.1](https://github.com/npm/registry-fetch/compare/v8.1.0...v8.1.1) (2020-06-30)

## [8.1.0](https://github.com/npm/registry-fetch/compare/v8.0.3...v8.1.0) (2020-05-20)


### Features

* add npm-command HTTP header ([1bb4eb2](https://github.com/npm/registry-fetch/commit/1bb4eb2c66ee8a0dc62558bdcff1b548e2bb9820))

### [8.0.3](https://github.com/npm/registry-fetch/compare/v8.0.2...v8.0.3) (2020-05-13)


### Bug Fixes

* update minipass and make-fetch-happen to latest ([3b6c5d0](https://github.com/npm/registry-fetch/commit/3b6c5d0d8ccd4c4a97862a65acef956f19aec127)), closes [#23](https://github.com/npm/registry-fetch/issues/23)

### [8.0.2](https://github.com/npm/registry-fetch/compare/v8.0.1...v8.0.2) (2020-05-04)


### Bug Fixes

* update make-fetch-happen to 8.0.6 ([226df2c](https://github.com/npm/registry-fetch/commit/226df2c32e3f9ed8ceefcfdbd11efb178181b442))

## [8.0.0](https://github.com/npm/registry-fetch/compare/v7.0.1...v8.0.0) (2020-02-24)


### ⚠ BREAKING CHANGES

* Removes the 'opts.refer' option and the HTTP Referer
header (unless explicitly added to the 'headers' option, of course).

PR-URL: https://github.com/npm/npm-registry-fetch/pull/25
Credit: @isaacs

### Bug Fixes

* remove referer header and opts.refer ([eb8f7af](https://github.com/npm/registry-fetch/commit/eb8f7af3c102834856604c1be664b00ca0fe8ef2)), closes [#25](https://github.com/npm/registry-fetch/issues/25)

### [7.0.1](https://github.com/npm/registry-fetch/compare/v7.0.0...v7.0.1) (2020-02-24)

## [7.0.0](https://github.com/npm/registry-fetch/compare/v6.0.2...v7.0.0) (2020-02-18)


### ⚠ BREAKING CHANGES

* figgy pudding is now nowhere to be found.
* this removes figgy-pudding, and drops several option
aliases.

Defaults and behavior are all the same, and this module is now using the
canonical camelCase option names that npm v7 will provide to all its
deps.

Related to: https://github.com/npm/rfcs/pull/102

PR-URL: https://github.com/npm/npm-registry-fetch/pull/22
Credit: @isaacs

### Bug Fixes

* Remove figgy-pudding, use canonical option names ([ede3c08](https://github.com/npm/registry-fetch/commit/ede3c087007fd1808e02b1af70562220d03b18a9)), closes [#22](https://github.com/npm/registry-fetch/issues/22)


* update cacache, ssri, make-fetch-happen ([57fcc88](https://github.com/npm/registry-fetch/commit/57fcc889bee03edcc0a2025d96a171039108c231))

### [6.0.2](https://github.com/npm/registry-fetch/compare/v6.0.1...v6.0.2) (2020-02-14)


### Bug Fixes

* always bypass cache when ?write=true ([83f89f3](https://github.com/npm/registry-fetch/commit/83f89f35abd2ed0507c869e37f90ed746375772c))

### [6.0.1](https://github.com/npm/registry-fetch/compare/v6.0.0...v6.0.1) (2020-02-14)


### Bug Fixes

* use 30s default for timeout as per README ([50e8afc](https://github.com/npm/registry-fetch/commit/50e8afc6ff850542feb588f9f9c64ebae59e72a0)), closes [#20](https://github.com/npm/registry-fetch/issues/20)

## [6.0.0](https://github.com/npm/registry-fetch/compare/v5.0.1...v6.0.0) (2019-12-17)


### ⚠ BREAKING CHANGES

* This drops support for node < 10.

There are some lint failures due to standard pushing for using WhatWG URL
objects instead of url.parse/url.resolve.  However, the code in this lib
does some fancy things with the query/search portions of the parsed url
object, so it'll take a bit of care to make it work properly.

### Bug Fixes

* detect CI so our tests don't fail in CI ([5813da6](https://github.com/npm/registry-fetch/commit/5813da634cef73b12e40373972d7937e6934fce0))
* Use WhatWG URLs instead of url.parse ([8ccfa8a](https://github.com/npm/registry-fetch/commit/8ccfa8a72c38cfedb0f525b7f453644fd4444f99))


* normalize settings, drop old nodes, update deps ([510b125](https://github.com/npm/registry-fetch/commit/510b1255cc7ed4bb397a34e0007757dae33e2275))

<a name="5.0.1"></a>
## [5.0.1](https://github.com/npm/registry-fetch/compare/v5.0.0...v5.0.1) (2019-11-11)



<a name="5.0.0"></a>
# [5.0.0](https://github.com/npm/registry-fetch/compare/v4.0.2...v5.0.0) (2019-10-04)


### Bug Fixes

* prefer const in getAuth function ([90ac7b1](https://github.com/npm/registry-fetch/commit/90ac7b1))
* use minizlib instead of core zlib ([e64702e](https://github.com/npm/registry-fetch/commit/e64702e))


### Features

* refactor to use Minipass streams ([bb37f20](https://github.com/npm/registry-fetch/commit/bb37f20))


### BREAKING CHANGES

* this replaces all core streams (except for some
PassThrough streams in a few tests) with Minipass streams, and updates
all deps to the latest and greatest Minipass versions of things.



<a name="4.0.2"></a>
## [4.0.2](https://github.com/npm/registry-fetch/compare/v4.0.0...v4.0.2) (2019-10-04)


### Bug Fixes

* Add null check on body on 401 errors ([e3a0186](https://github.com/npm/registry-fetch/commit/e3a0186)), closes [#9](https://github.com/npm/registry-fetch/issues/9)
* **deps:** Add explicit dependency on safe-buffer ([8eae5f0](https://github.com/npm/registry-fetch/commit/8eae5f0)), closes [npm/libnpmaccess#2](https://github.com/npm/libnpmaccess/issues/2) [#3](https://github.com/npm/registry-fetch/issues/3)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/npm/registry-fetch/compare/v3.9.1...v4.0.0) (2019-07-15)


* cacache@12.0.0, infer uid from cache folder ([0c4f060](https://github.com/npm/registry-fetch/commit/0c4f060))


### BREAKING CHANGES

* uid and gid are inferred from cache folder, rather than
being passed in as options.



<a name="3.9.1"></a>
## [3.9.1](https://github.com/npm/registry-fetch/compare/v3.9.0...v3.9.1) (2019-07-02)



<a name="3.9.0"></a>
# [3.9.0](https://github.com/npm/registry-fetch/compare/v3.8.0...v3.9.0) (2019-01-24)


### Features

* **auth:** support username:password encoded legacy _auth ([a91f90c](https://github.com/npm/registry-fetch/commit/a91f90c))



<a name="3.8.0"></a>
# [3.8.0](https://github.com/npm/registry-fetch/compare/v3.7.0...v3.8.0) (2018-08-23)


### Features

* **mapJson:** add support for passing in json stream mapper ([0600986](https://github.com/npm/registry-fetch/commit/0600986))



<a name="3.7.0"></a>
# [3.7.0](https://github.com/npm/registry-fetch/compare/v3.6.0...v3.7.0) (2018-08-23)


### Features

* **json.stream:** add utility function for streamed JSON parsing ([051d969](https://github.com/npm/registry-fetch/commit/051d969))



<a name="3.6.0"></a>
# [3.6.0](https://github.com/npm/registry-fetch/compare/v3.5.0...v3.6.0) (2018-08-22)


### Bug Fixes

* **docs:** document opts.forceAuth ([40bcd65](https://github.com/npm/registry-fetch/commit/40bcd65))


### Features

* **opts.ignoreBody:** add a boolean to throw away response bodies ([6923702](https://github.com/npm/registry-fetch/commit/6923702))



<a name="3.5.0"></a>
# [3.5.0](https://github.com/npm/registry-fetch/compare/v3.4.0...v3.5.0) (2018-08-22)


### Features

* **pkgid:** heuristic pkgid calculation for errors ([2e789a5](https://github.com/npm/registry-fetch/commit/2e789a5))



<a name="3.4.0"></a>
# [3.4.0](https://github.com/npm/registry-fetch/compare/v3.3.0...v3.4.0) (2018-08-22)


### Bug Fixes

* **deps:** use new figgy-pudding with aliases fix ([0308f54](https://github.com/npm/registry-fetch/commit/0308f54))


### Features

* **auth:** add forceAuth option to force a specific auth mechanism ([4524d17](https://github.com/npm/registry-fetch/commit/4524d17))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/npm/registry-fetch/compare/v3.2.1...v3.3.0) (2018-08-21)


### Bug Fixes

* **query:** stop including undefined keys ([4718b1b](https://github.com/npm/registry-fetch/commit/4718b1b))


### Features

* **otp:** use heuristic detection for malformed EOTP responses ([f035194](https://github.com/npm/registry-fetch/commit/f035194))



<a name="3.2.1"></a>
## [3.2.1](https://github.com/npm/registry-fetch/compare/v3.2.0...v3.2.1) (2018-08-16)


### Bug Fixes

* **opts:** pass through non-null opts.retry ([beba040](https://github.com/npm/registry-fetch/commit/beba040))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/npm/registry-fetch/compare/v3.1.1...v3.2.0) (2018-07-27)


### Features

* **gzip:** add opts.gzip convenience opt ([340abe0](https://github.com/npm/registry-fetch/commit/340abe0))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/npm/registry-fetch/compare/v3.1.0...v3.1.1) (2018-04-09)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/npm/registry-fetch/compare/v3.0.0...v3.1.0) (2018-04-09)


### Features

* **config:** support no-proxy and https-proxy options ([9aa906b](https://github.com/npm/registry-fetch/commit/9aa906b))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/npm/registry-fetch/compare/v2.1.0...v3.0.0) (2018-04-09)


### Bug Fixes

* **api:** pacote integration-related fixes ([a29de4f](https://github.com/npm/registry-fetch/commit/a29de4f))
* **config:** stop caring about opts.config ([5856a6f](https://github.com/npm/registry-fetch/commit/5856a6f))


### BREAKING CHANGES

* **config:** opts.config is no longer supported. Pass the options down in opts itself.



<a name="2.1.0"></a>
# [2.1.0](https://github.com/npm/registry-fetch/compare/v2.0.0...v2.1.0) (2018-04-08)


### Features

* **token:** accept opts.token for opts._authToken ([108c9f0](https://github.com/npm/registry-fetch/commit/108c9f0))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/npm/registry-fetch/compare/v1.1.1...v2.0.0) (2018-04-08)


### meta

* drop support for node@4 ([758536e](https://github.com/npm/registry-fetch/commit/758536e))


### BREAKING CHANGES

* node@4 is no longer supported



<a name="1.1.1"></a>
## [1.1.1](https://github.com/npm/registry-fetch/compare/v1.1.0...v1.1.1) (2018-04-06)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/npm/registry-fetch/compare/v1.0.1...v1.1.0) (2018-03-16)


### Features

* **specs:** can use opts.spec to trigger pickManifest ([85c4ac9](https://github.com/npm/registry-fetch/commit/85c4ac9))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/npm/registry-fetch/compare/v1.0.0...v1.0.1) (2018-03-16)


### Bug Fixes

* **query:** oops console.log ([870e4f5](https://github.com/npm/registry-fetch/commit/870e4f5))



<a name="1.0.0"></a>
# 1.0.0 (2018-03-16)


### Bug Fixes

* **auth:** get auth working with all the little details ([84b94ba](https://github.com/npm/registry-fetch/commit/84b94ba))
* **deps:** add bluebird as an actual dep ([1286e31](https://github.com/npm/registry-fetch/commit/1286e31))
* **errors:** Unknown auth errors use default code ([#1](https://github.com/npm/registry-fetch/issues/1)) ([3d91b93](https://github.com/npm/registry-fetch/commit/3d91b93))
* **standard:** remove args from invocation ([9620a0a](https://github.com/npm/registry-fetch/commit/9620a0a))


### Features

* **api:** baseline kinda-working API impl ([bf91f9f](https://github.com/npm/registry-fetch/commit/bf91f9f))
* **body:** automatic handling of different opts.body values ([f3b97db](https://github.com/npm/registry-fetch/commit/f3b97db))
* **config:** nicer input config input handling ([b9ce21d](https://github.com/npm/registry-fetch/commit/b9ce21d))
* **opts:** use figgy-pudding for opts handling ([0abd527](https://github.com/npm/registry-fetch/commit/0abd527))
* **query:** add query utility support ([65ea8b1](https://github.com/npm/registry-fetch/commit/65ea8b1))

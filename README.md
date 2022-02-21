### Mounting components wirh vue test utils
1. `npm install --save-dev @vue/test-utils@1`

2. Update snapshot `yarn jest specs/test.spec.js -u`
3. shallowMounts
   1. Is the same as normal mount method
   2. But child components will get stub automatically

```html
  console.log specs/test.spec.js:21

    <div>
      <ul>
        # Real items printed out
        <li><strong>Iron Man</strong></li>
        <li><strong>Avengers</strong></li>
        <li><strong>Infitinity War</strong></li>
      </ul>
    </div>

  console.log specs/test.spec.js:22
    <div>
      <ul>
        # Stubbed items printed out
        <listitem-stub movie="Iron Man"></listitem-stub>
        <listitem-stub movie="Avengers"></listitem-stub>
        <listitem-stub movie="Infitinity War"></listitem-stub>
      </ul>
    </div>
``` 

4. Use mount as default approach as it helps to detect potential errors regarding child componets early
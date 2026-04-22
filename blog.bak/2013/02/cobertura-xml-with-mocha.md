# Generate cobertura-xml report with mocha

Using [mocha-cobertura-reporter](https://github.com/sjonnet19/mocha-cobertura-reporter) module.

```bash
$ npm install mocha-cobertura-reporter

$ XXX_COV=1 ./node_modules/.bin/mocha --reporter mocha-cobertura-reporter > cobertura.xml
```

covertura.xml contents

```xml
<coverage branch-rate="0" line-rate="1" timestamp="1359942445859" version="3.5.1">
  <packages>
    <package branch-rate="0" complexity="0.0" line-rate="1" name=".">
      <classes>
        <class branch-rate="0" complexity="0.0" filename="utility.js" line-rate="1" name="utility">
          <methods/>
          <lines>
            <line hits="" number="1"/>
            <line hits="" number="2"/>
            <line hits="" number="3"/>
            // ....
            <line hits="" number="82"/>
            <line hits="" number="83"/>
            <line hits="" number="84"/>
          </lines>
        </class>
      </classes>
    </package>
  </packages>
</coverage>
```

## Links

 * [cobertura-xml issue](https://github.com/fengmk2/jscover/issues/4)
 * [junit reporter issue](https://github.com/visionmedia/mocha/pull/349)
 * [mocha cobertura reporter](https://github.com/sjonnet19/mocha-cobertura-reporter)
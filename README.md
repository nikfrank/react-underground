this is a project about modularizing all state transition code to the component

given such, all impure / async / network behaviour can me modularized and composabilized to be triggered by actions at will.

there are four things a component can have


action

object with .type or .async


reducer

(state, action)=> nuState


decay

(state)=> shouldDecay  // predicate
actionOnDecay


name

unique name for lexical scope in application





the HOC here is meant to facade the redux workflow without redux, and to provide the concept of state decay modes.


state decays are triggered from componentWillReceiveProps

only when the predicate changes from false to true will the decayAction be triggered

it is conceivable that a series of downstream sync actions could be triggered together (without rendering)


---

installation

```bash
yarn add react-underground
```


```js
import React from 'react';
import ReactDOM from 'react-dom';

import SomeComponent from './SomeComponent';

const UndergroundComponent = underground( SomeComponent );

ReactDOM.render(<SomeComponent onAction={console.log.bind(console)}/>,
                document.getElementById('donald') );
```


installation for development

```bash
cd ~/code
git clone https://github.com/nikfrank/react-underground.git
cd react-underground
yarn run postclone
```
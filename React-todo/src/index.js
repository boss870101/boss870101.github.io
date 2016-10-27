import ComponentX from "./scripts/libs/ComponentX.js";
import { Todo } from "./scripts/containers/todo/todo";

ComponentX.initSharedState( {
  list: [
    { value: '学习 JS', done: true },
    { value: '学习 React学习', done: false },
    { value: '学习 Component', done: false },
    { value: '学习 Component \\d+ 423425', done: false },
    { value: '学习 Component', done: false },
  ],
  mode: 'add',
  searchText: ''
} );

ReactDOM.render(
  <Todo />,
  document.querySelector( '.window-wrapper' )    
);
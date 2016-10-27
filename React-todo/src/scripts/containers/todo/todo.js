import ComponentX from "../../libs/ComponentX.js";
import { Header } from "./header.js"; 
import { AddOrSearch } from "./add-or-search.js"; 
import { TodoList } from "./todo-list.js"; 
import { Footer } from "./footer.js"; 

export class Todo extends ComponentX{
  constructor( props ){
    super( props );
  }

  render(){
    return (
      <div>
        <Header />
        <AddOrSearch />
        <TodoList />
        <Footer />
      </div>
    );
  }
}
 
      
  
  

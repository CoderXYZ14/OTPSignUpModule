import { useState } from "react";
import { Button } from "./components/ui/button";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-3xl">
      Hello
      <Button>Click me</Button>
    </div>
  );
}

export default App;

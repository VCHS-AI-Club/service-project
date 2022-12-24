import React from "react";
import { Button, Container, H1, H2 } from "../components/ui";

const uitest = () => {
  return (
    <Container>
      <H1>Heading One</H1>
      <H2>Heading Two</H2>
      <div className="flex gap-2">
        <Button variant="primary">Click Me</Button>
        <Button variant="secondary">Click Me</Button>
        <Button variant="danger">Click Me</Button>
      </div>
    </Container>
  );
};

export default uitest;

import React from "react";

export type TestComponentMessages = {
  title: string;
  content: string;
};

type TestComponentProps = { messages: TestComponentMessages };

export interface TestComponentInterface {
  (props: TestComponentProps): React.ReactElement | null;
}

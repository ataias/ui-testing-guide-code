import { InboxScreen } from "./InboxScreen";
import React from "react";
import { Default as TaskListDefault } from "./components/TaskList.stories";
import { rest } from "msw";

export default {
  component: InboxScreen,
  title: "InboxScreen",
};

const Template = (args) => <InboxScreen {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get("/tasks", (req, res, ctx) => {
        return res(ctx.json(TaskListDefault.args));
      }),
    ],
  },
};

export const Error = Template.bind({});
Error.args = {
  error: "Something",
};
Error.parameters = {
  msw: {
    handlers: [
      rest.get("/tasks", (req, res, ctx) => {
        return res(ctx.json([]));
      }),
    ],
  },
};

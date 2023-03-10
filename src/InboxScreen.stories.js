import { findByRole, userEvent, within } from "@storybook/testing-library";

import { InboxScreen } from "./InboxScreen";
import React from "react";
import { Default as TaskListDefault } from "./components/TaskList.stories";
import { expect } from "@storybook/jest";
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

export const PinTask = Template.bind({});
PinTask.parameters = Default.parameters;
PinTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole("listitem", { name });

  const itemToPin = await getTask("Export logo");
  const pinButton = await findByRole(itemToPin, "button", { name: "pin" });
  await userEvent.click(pinButton);

  const unpinButton = within(itemToPin).getByRole("button", { name: "unpin" });
  await expect(unpinButton).toBeInTheDocument();
};

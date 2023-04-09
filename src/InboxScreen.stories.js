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
  expect(unpinButton).toBeInTheDocument();
};

export const ArchiveTask = Template.bind({});
ArchiveTask.parameters = Default.parameters;
ArchiveTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole("listitem", { name });

  const itemToArchive = await getTask("QA dropdown");
  const archiveCheckbox = await findByRole(itemToArchive, "checkbox");
  await userEvent.click(archiveCheckbox);

  expect(archiveCheckbox.checked).toBe(true);
};

export const EditTask = Template.bind({});
EditTask.parameters = Default.parameters;
EditTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole("listitem", { name });

  const itemToEdit = await getTask("Fix bug in input error state");
  const taskInput = await findByRole(itemToEdit, "textbox");

  await userEvent.type(taskInput, " and disabled state");
  expect(taskInput.value).toBe(
    "Fix bug in input error state and disabled state",
  );
};

export const DeleteTask = Template.bind({});
DeleteTask.parameters = { ...Default.parameters };
DeleteTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole("listitem", { name });

  const itemToDelete = await getTask("Build a date picker");
  const deleteButton = await findByRole(itemToDelete, "button", {
    name: "delete",
  });
  await userEvent.click(deleteButton);

  expect(canvas.getAllByRole("listitem").length).toBe(5);
};

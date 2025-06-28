export type Category = "Today" | "Work" | "Study" | "Personal";

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export type TodoStorage = {
  [date: string]: {
    [category in Category]?: TodoItem[];
  };
};

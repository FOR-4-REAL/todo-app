import * as React from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isToday from "dayjs/plugin/isToday";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

dayjs.extend(weekday);
dayjs.extend(isToday);

const MAX_TODOS = 10;

function getCurrentWeek(): string[] {
  const start = dayjs().weekday(0); // Sunday
  return Array.from({ length: 7 }, (_, i) =>
    start.add(i, "day").format("YYYY-MM-DD")
  );
}

export function WeeklyCalendarTodo() {
  const [selectedDate, setSelectedDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [weekDays, _] = React.useState<string[]>(getCurrentWeek());
  const [todos, setTodos] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");

  // Load todos from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem(`todos-${selectedDate}`);
    setTodos(saved ? JSON.parse(saved) : []);
  }, [selectedDate]);

  const saveTodos = (next: string[]) => {
    localStorage.setItem(`todos-${selectedDate}`, JSON.stringify(next));
    setTodos(next);
  };

  const handleAdd = () => {
    if (input.trim() === "" || todos.length >= MAX_TODOS) return;
    saveTodos([...todos, input.trim()]);
    setInput("");
  };

  const handleRemove = (index: number) => {
    const next = todos.filter((_, i) => i !== index);
    saveTodos(next);
  };

  return (
    <div className="w-[975px] p-4">
      <Tabs value={selectedDate} onValueChange={setSelectedDate}>
        <TabsList className="flex justify-between overflow-x-auto gap-2 bg-muted p-2 rounded-md">
          {weekDays.map((date) => {
            const label = dayjs(date).format("ddd"); // ex: Su 23
            const day = dayjs(date).format("D");
            return (
              <TabsTrigger
                key={date}
                value={date}
                className={`w-[60px] rounded-md text-xs flex flex-col items-center justify-center ${
                  dayjs(date).isToday() ? "bg-gray-400 text-white" : ""
                }`}
              >
                <div>{label}</div>
                <div> {day}</div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedDate} className="mt-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="할 일 추가"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button onClick={handleAdd} disabled={todos.length >= MAX_TODOS}>
                추가
              </Button>
            </div>

            <ul className="space-y-2">
              {todos.map((todo, idx) => (
                <li
                  key={idx}
                  className="flex justify-between bg-gray-100 p-2 rounded-md"
                >
                  <span>{todo}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(idx)}
                  >
                    삭제
                  </Button>
                </li>
              ))}
              {todos.length === 0 && (
                <li className="text-muted-foreground text-sm">
                  할 일이 없습니다.
                </li>
              )}
            </ul>

            {todos.length >= MAX_TODOS && (
              <p className="text-red-500 text-sm">
                최대 {MAX_TODOS}개까지 입력할 수 있습니다.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

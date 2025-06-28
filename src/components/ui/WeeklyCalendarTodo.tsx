import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isToday from "dayjs/plugin/isToday";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // 올바른 경로

dayjs.extend(weekday);
dayjs.extend(isToday);

type Todo = {
  text: string;
  done: boolean;
};

const MAX_TODOS = 10;

function getCurrentWeek(): string[] {
  const start = dayjs().weekday(0); // Sunday
  return Array.from({ length: 7 }, (_, i) =>
    start.add(i, "day").format("YYYY-MM-DD")
  );
}

export function WeeklyCalendarTodo() {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [weekDays] = useState<string[]>(getCurrentWeek());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`todos-${selectedDate}`);
      const parsed = saved ? JSON.parse(saved) : [];

      // 데이터 유효성 검사
      if (!Array.isArray(parsed)) throw new Error("Invalid format");
      const isValid = parsed.every(
        (item: any) =>
          typeof item === "object" &&
          typeof item.text === "string" &&
          typeof item.done === "boolean"
      );

      if (!isValid) throw new Error("Invalid structure");

      setTodos(parsed);
    } catch {
      setTodos([]);
      localStorage.removeItem(`todos-${selectedDate}`);
    }
  }, [selectedDate]);

  const saveTodos = (next: Todo[]) => {
    localStorage.setItem(`todos-${selectedDate}`, JSON.stringify(next));
    setTodos(next);
  };

  const handleAdd = () => {
    if (input.trim() === "" || todos.length >= MAX_TODOS) return;
    saveTodos([...todos, { text: input.trim(), done: false }]);
    setInput("");
  };

  const handleRemove = (index: number) => {
    const next = todos.filter((_, i) => i !== index);
    saveTodos(next);
  };

  const toggleDone = (index: number) => {
    const next = todos.map((todo, i) =>
      i === index ? { ...todo, done: !todo.done } : todo
    );
    saveTodos(next);
  };

  return (
    <div className="w-[975px] p-4">
      <Tabs value={selectedDate} onValueChange={setSelectedDate}>
        <TabsList className="flex justify-between overflow-x-auto gap-2 bg-muted p-2 rounded-md">
          {weekDays.map((date) => {
            const label = dayjs(date).format("ddd");
            const day = dayjs(date).format("D");
            const isTodayDate = dayjs(date).isToday();
            return (
              <TabsTrigger
                key={date}
                value={date}
                className={`w-[60px] rounded-md text-xs flex flex-col items-center justify-center ${
                  isTodayDate ? "bg-gray-400 text-white" : ""
                }`}
              >
                <span>{label}</span>
                <span>{day}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedDate} className="mt-6">
          <div className="space-y-4">
            <ul className="space-y-2">
              {todos.map((todo, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={todo.done}
                      onCheckedChange={() => toggleDone(idx)}
                    />
                    <span
                      className={`text-sm ${
                        todo.done ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
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

            <div className="flex gap-2">
              <Input
                placeholder="할 일 추가"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === "Enter") handleAdd();
                }}
              />
              <Button onClick={handleAdd} disabled={todos.length >= MAX_TODOS}>
                추가
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

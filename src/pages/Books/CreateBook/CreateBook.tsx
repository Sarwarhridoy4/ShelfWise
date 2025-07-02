// src/pages/CreateBook.tsx
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type NewBookForm = {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
};

const GENRES = ["TECHNICAL", "SELF‑HELP", "FICTION", "NON‑FICTION", "OTHER"];

const CreateBook = () => {
  const navigate = useNavigate();

  const form = useForm<NewBookForm>({
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      isbn: "",
      description: "",
      copies: 1,
    },
  });

  const onSubmit = (data: NewBookForm) => {
    const books = JSON.parse(localStorage.getItem("books") || "[]");
    const newBook = { ...data, _id: crypto.randomUUID() };
    localStorage.setItem("books", JSON.stringify([...books, newBook]));
    form.reset();
    navigate("/books");
  };

  return (
    <main className='container mx-auto px-4 py-10'>
      <Card className='mx-auto max-w-2xl shadow-lg'>
        <CardHeader>
          <CardTitle>Add New Book</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
              noValidate
            >
              {/* Title */}
              <FormField
                control={form.control}
                name='title'
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder='Clean Code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author */}
              <FormField
                control={form.control}
                name='author'
                rules={{ required: "Author is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author *</FormLabel>
                    <FormControl>
                      <Input placeholder='Robert C. Martin' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Genre */}
              <FormField
                control={form.control}
                name='genre'
                rules={{ required: "Select a genre" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='Choose…' />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ISBN */}
              <FormField
                control={form.control}
                name='isbn'
                rules={{ required: "ISBN is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN *</FormLabel>
                    <FormControl>
                      <Input placeholder='9780132350884' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder='A handbook of agile software craftsmanship.'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Copies */}
              <FormField
                control={form.control}
                name='copies'
                rules={{
                  required: "Number of copies is required",
                  min: { value: 1, message: "At least one copy" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copies *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className='flex gap-4 pt-2'>
                <Button type='submit'>Save Book</Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateBook;

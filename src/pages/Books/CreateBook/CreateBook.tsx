// src/pages/CreateBook.tsx
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAddBookMutation } from "@/redux/api/libraryApi";

/* ────────────────── Types & schema ────────────────── */

const newBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  isbn: z.string().min(1, "ISBN is required"),
  description: z.string().optional(),
  copies: z.coerce.number().int().min(1, "At least one copy"),
});

type NewBookForm = z.infer<typeof newBookSchema>;

/* ────────────────── Component ────────────────── */
const CreateBook = () => {
  const navigate = useNavigate();
  const [addBook, { isLoading }] = useAddBookMutation();

  const form = useForm<NewBookForm>({
    resolver: zodResolver(newBookSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: undefined as unknown as NewBookForm["genre"],
      isbn: "",
      description: "",
      copies: 1,
    },
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: NewBookForm) => {
      // optimistic toast: shown immediately, updated later
      const tId = toast.loading("Adding book…");
      try {
        await addBook(data).unwrap();
        toast.success("Book added successfully 🎉", { id: tId });
        form.reset();
        navigate("/books", { replace: true });
      } catch (err) {
        toast.error(
          (err as { data?: { message?: string }; error?: string })?.data
            ?.message ||
            (err as { error?: string }).error ||
            "Failed to add book. Please try again.",
          { id: tId }
        );
      }
    },
    [addBook, form, navigate]
  );

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form;

  return (
    <main className='container mx-auto px-4 py-10'>
      <Card className='mx-auto max-w-2xl shadow-lg'>
        <CardHeader>
          <CardTitle>Add New Book</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='grid gap-6 md:grid-cols-2'
              noValidate
            >
              {/* Title */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Sapiens: A Brief History…'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author */}
              <FormField
                control={form.control}
                name='author'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Author *</FormLabel>
                    <FormControl>
                      <Input placeholder='Yuval Noah Harari' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Genre */}
              <FormField
                control={form.control}
                name='genre'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Genre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='eg. Non-fiction, History'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ISBN */}
              <FormField
                control={form.control}
                name='isbn'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>ISBN *</FormLabel>
                    <FormControl>
                      <Input placeholder='9780062316110' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description – spans full width */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder='Explores the history and impact of Homo sapiens.'
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
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Copies *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        inputMode='numeric'
                        {...field}
                        onChange={(e) => field.onChange(+e.currentTarget.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions – full width row */}
              <div className='md:col-span-2 flex gap-4 pt-2'>
                <Button
                  type='submit'
                  disabled={isLoading || !isDirty || !isValid}
                >
                  {isLoading ? "Saving…" : "Save Book"}
                </Button>
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

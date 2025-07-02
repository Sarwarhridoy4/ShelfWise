// src/pages/BookDetails.tsx
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, Info, Layers } from "lucide-react";

/* ─────── Dummy data ─────── */
const dummyBook = {
  _id: "6864bc57818d9bfb8dee41d6",
  title: "Clean Code",
  author: "Robert C. Martin",
  genre: "TECHNICAL",
  isbn: "9780132350884",
  description:
    "Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. This book teaches the principles, patterns, and practices of writing clean code.",
  copies: 7,
  available: 4,
  cover: "https://placehold.co/240x360/png?text=Cover+Art",
};

/* ─────── Types for the borrow dialog ─────── */
type BorrowForm = {
  quantity: number;
  dueDate: string; // YYYY‑MM‑DD
};

const BookDetails = () => {
  const {
    _id,
    title,
    author,
    genre,
    isbn,
    description,
    copies,
    available,
    cover,
  } = dummyBook;

  /* ── Borrow form setup ── */
  const borrowForm = useForm<BorrowForm>({
    defaultValues: { quantity: 1, dueDate: "" },
  });

  const borrowSubmit = (values: BorrowForm) => {
    const payload = {
      book: _id,
      quantity: values.quantity,
      dueDate: values.dueDate, // keep ISO‑date string
    };
    console.log("Submitting borrow payload:", payload);
    // TODO: call mutation → borrowBook(payload)
    borrowForm.reset();
  };

  return (
    <main className='container mx-auto px-4 py-10'>
      <Card className='mx-auto max-w-4xl shadow-lg'>
        {/* ── Header ───────────────────────────── */}
        <CardHeader className='flex flex-row gap-6'>
          <img
            src={cover}
            alt={`${title} cover`}
            className='h-60 w-40 object-cover rounded-md border'
          />

          <div className='flex flex-col justify-between flex-1'>
            <div>
              <CardTitle className='text-2xl'>{title}</CardTitle>
              <p className='text-muted-foreground mb-2'>by {author}</p>

              <div className='flex flex-wrap gap-2'>
                <Badge variant='secondary'>{genre}</Badge>
                <Badge>{available > 0 ? "Available" : "Out of stock"}</Badge>
              </div>
            </div>

            <div className='flex gap-4 text-sm'>
              <span>
                Total copies: <strong>{copies}</strong>
              </span>
              <Separator orientation='vertical' />
              <span>
                Available: <strong>{available}</strong>
              </span>
            </div>

            {/* ── Action buttons ── */}
            <div className='mt-4 flex gap-4'>
              {/* Borrow dialog trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={available === 0}>Borrow Book</Button>
                </DialogTrigger>

                <DialogContent className='sm:max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Borrow “{title}”</DialogTitle>
                    <DialogDescription>
                      Enter quantity and a due date.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Borrow form */}
                  <Form {...borrowForm}>
                    <form
                      onSubmit={borrowForm.handleSubmit(borrowSubmit)}
                      className='space-y-4'
                    >
                      <FormField
                        control={borrowForm.control}
                        name='quantity'
                        rules={{
                          required: "Quantity is required",
                          min: { value: 1, message: "Minimum 1" },
                          max: {
                            value: available,
                            message: `Only ${available} available`,
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                min={1}
                                max={available}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={borrowForm.control}
                        name='dueDate'
                        rules={{ required: "Due date is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input type='date' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter className='mt-4'>
                        <DialogClose asChild>
                          <Button type='button' variant='outline'>
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type='submit'>Confirm Borrow</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Button asChild variant='outline'>
                <Link to='/books'>Back to List</Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* ── Tabs ─────────────────────────────── */}
        <CardContent>
          <Tabs defaultValue='details' className='w-full'>
            <TabsList className='mb-6'>
              <TabsTrigger value='details' className='flex items-center gap-1'>
                <Info className='h-4 w-4' /> Details
              </TabsTrigger>
              <TabsTrigger value='meta' className='flex items-center gap-1'>
                <Layers className='h-4 w-4' /> Metadata
              </TabsTrigger>
            </TabsList>

            <TabsContent value='details' className='space-y-4'>
              <p className='leading-relaxed'>{description}</p>
            </TabsContent>

            <TabsContent value='meta'>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm'>
                <div>
                  <p className='text-muted-foreground'>ISBN</p>
                  <p>{isbn}</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Genre</p>
                  <p>{genre}</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Total Copies</p>
                  <p>{copies}</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Available</p>
                  <p>{available}</p>
                </div>
                <div className='col-span-full flex items-center gap-2'>
                  <BookOpen className='h-4 w-4' />
                  <span className='text-muted-foreground'>
                    Please return books within 14 days to avoid late fees.
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default BookDetails;

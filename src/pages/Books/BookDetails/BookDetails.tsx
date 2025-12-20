/* eslint-disable @typescript-eslint/no-explicit-any */
/* src/pages/Books/BookDetails/BookDetails.tsx */
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
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
import { toast } from "sonner";
import { useGetBookQuery, useBorrowBookMutation } from "@/redux/api/libraryApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*                           Type Declarations                         */
/* ------------------------------------------------------------------ */

interface BorrowFormValues {
  quantity: number;
  dueDate: Date | null;
}

const isDate = (v: unknown): v is Date => v instanceof Date;

/* ------------------------------------------------------------------ */
/*                         Utility Functions                           */
/* ------------------------------------------------------------------ */

const getErrorMessage = (err: unknown): string => {
  if (typeof err === "string") return err;

  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err &&
    typeof (err as any).data?.message === "string"
  ) {
    return (err as any).data.message as string;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "error" in err &&
    typeof (err as any).error === "string"
  ) {
    return (err as any).error as string;
  }

  return "Something went wrong. Please try again.";
};

/* ------------------------------------------------------------------ */
/*                          Component Body                             */
/* ------------------------------------------------------------------ */

const BookDetails: React.FC = () => {
  /* routing */
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* queries */
  const {
    data: bookWrapper,
    isLoading,
    isError,
  } = useGetBookQuery(id ?? "", { skip: !id });

  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();

  /* form */
  const borrowForm = useForm<BorrowFormValues>({
    defaultValues: { quantity: 1, dueDate: null },
  });

  const borrowSubmit = async (values: BorrowFormValues) => {
    const book = bookWrapper?.data;
    if (!book || !values?.dueDate) return;

    try {
      await borrowBook({
        book: book._id,
        quantity: values?.quantity,
        dueDate: format(values?.dueDate, "yyyy-MM-dd"),
      }).unwrap();

      toast.success("Borrow confirmed 🚀");
      borrowForm.reset();
      navigate("/borrow-summary");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  /* loading / error states */
  if (isLoading) {
    return (
      <main className='container mx-auto px-4 py-10'>
        <Skeleton className='h-96 max-w-4xl mx-auto' />
      </main>
    );
  }

  if (isError || !bookWrapper?.data) {
    return (
      <main className='container mx-auto px-4 py-10 text-center'>
        <p className='text-destructive'>Couldn’t load the book.</p>
        <Button asChild variant='outline' className='mt-4'>
          <Link to='/books'>Back to list</Link>
        </Button>
      </main>
    );
  }

  /* ---------------------------------------------------------------- */
  /*                             Render                                */
  /* ---------------------------------------------------------------- */
  const { title, author, genre, isbn, description, copies, available } =
    bookWrapper.data;

  return (
    <main className='container mx-auto px-4 py-10'>
      <Card className='mx-auto max-w-4xl shadow-lg'>
        <CardHeader className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
          <img
            src={`https://placehold.co/240x360/png?text=${encodeURIComponent(
              title
            )}`}
            alt={`${title} cover`}
            className='w-full max-w-40 sm:w-40 sm:h-60 object-cover rounded-md border'
          />

          <div className='flex flex-col justify-between flex-1 mt-4 sm:mt-5'>
            {/* Title & badges */}
            <div className='text-center sm:text-left'>
              <CardTitle className='text-2xl'>{title}</CardTitle>
              <p className='text-muted-foreground mb-2'>by {author}</p>

              <div className='flex flex-wrap justify-center sm:justify-start gap-2 mt-4 sm:my-5'>
                <Badge variant='secondary'>{genre}</Badge>
                <Badge>{available ? "Available" : "Out of stock"}</Badge>
              </div>
            </div>

            {/* copies / availability */}
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4 text-sm mt-4'>
              <span>
                Total copies: <strong>{copies}</strong>
              </span>
              <Separator orientation='vertical' className='hidden sm:inline' />
              <span>
                Available: <strong>{available ? "YES" : "NO"}</strong>
              </span>
            </div>

            {/* action buttons */}
            <div className='mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4 w-full'>
              {/* Borrow dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='w-full sm:w-auto' disabled={!available}>
                    Borrow Book
                  </Button>
                </DialogTrigger>

                <DialogContent className='sm:max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Borrow “{title}”</DialogTitle>
                    <DialogDescription>
                      Enter quantity and a due date.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...borrowForm}>
                    <form
                      onSubmit={borrowForm.handleSubmit(borrowSubmit)}
                      className='space-y-4'
                    >
                      {/* Quantity field */}
                      <FormField<BorrowFormValues, "quantity">
                        control={borrowForm.control}
                        name='quantity'
                        rules={{
                          required: "Quantity is required",
                          min: { value: 1, message: "Minimum 1" },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                min={1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.currentTarget.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Due‑date field */}
                      <FormField<BorrowFormValues, "dueDate">
                        control={borrowForm.control}
                        name='dueDate'
                        rules={{ required: "Due date is required" }}
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {isDate(field.value)
                                      ? format(field.value, "PPP")
                                      : "Pick a date"}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='p-0 w-auto'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={
                                    isDate(field.value)
                                      ? field.value
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date ?? null)
                                  }
                                  initialFocus
                                  disabled={(date) => date < new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* footer */}
                      <DialogFooter className='mt-4'>
                        <DialogClose asChild>
                          <Button
                            type='button'
                            variant='outline'
                            disabled={isBorrowing}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type='submit' disabled={isBorrowing}>
                          {isBorrowing ? "Borrowing…" : "Confirm Borrow"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* back button */}
              <Button asChild variant='outline' className='w-full sm:w-auto'>
                <Link to='/books'>Back to List</Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Tabs */}
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

            {/* Details tab */}
            <TabsContent value='details' className='space-y-4'>
              <p className='leading-relaxed'>{description}</p>
            </TabsContent>

            {/* Metadata tab */}
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
                  <p>{available ? "Available" : "Not Available"}</p>
                </div>
                <div className='col-span-full flex items-center gap-2'>
                  <BookOpen className='h-4 w-4' />
                  <span className='text-muted-foreground'>
                    Please return books within 14&nbsp;days to avoid late fees.
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

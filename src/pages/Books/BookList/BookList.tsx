// src/pages/BookList.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  useGetBooksQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from "@/redux/api/libraryApi";
import { type IBook } from "@/redux/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setPage,
  setPerPage,
  setSortBy,
  type SortBy,
} from "@/redux/slices/bookListFiltersSlice";

/* ─────────────────────────────────────────── */

const BookList = () => {
  const {
    data: booksPayload,
    isLoading,
    isError,
    isFetching,
  } = useGetBooksQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 60_000,
  });

  const books = useMemo(() => booksPayload?.data ?? [], [booksPayload]);

  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const dispatch = useAppDispatch();
  const { perPage, sortBy, page } = useAppSelector((s) => s.bookListFilters);

  const [selected, setSelected] = useState<IBook | null>(null);
  const [form, setForm] = useState<
    Omit<IBook, "_id" | "available" | "createdAt" | "updatedAt">
  >({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    copies: 0,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Couldn’t fetch books", {
        description: "Check your connection and try again.",
      });
    }
  }, [isError]);

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    switch (sortBy) {
      case "copies":
        return copy.sort((a, b) => b.copies - a.copies);
      case "title":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "author":
        return copy.sort((a, b) => a.author.localeCompare(b.author));
      default:
        return copy;
    }
  }, [books, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / perPage));
  const currentPageBooks = sortedBooks.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    if (page > totalPages) dispatch(setPage(totalPages));
  }, [page, totalPages, dispatch]);

  const openEdit = (book: IBook) => {
    setSelected(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      copies: book.copies,
    });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      await updateBook({ id: selected._id, body: form }).unwrap();
      toast.success("Book updated", { description: `${form.title} saved.` });
      setSelected(null);
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error("Update failed", {
        description: error?.data?.message ?? "Unknown error.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id).unwrap();
      toast.success("Book deleted");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error("Delete failed", {
        description: error?.data?.message ?? "Unknown error.",
      });
    }
  };

  return (
    <div className='container mx-auto px-4 py-10'>
      <h2 className='mb-6 text-2xl font-bold'>Books</h2>

      <div className='mb-4 flex flex-wrap items-center gap-4'>
        <Select
          value={String(perPage)}
          onValueChange={(v) => dispatch(setPerPage(Number(v)))}
        >
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder='Per page' />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(v) => dispatch(setSortBy(v as SortBy))}
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='title'>Title</SelectItem>
            <SelectItem value='author'>Author</SelectItem>
            <SelectItem value='copies'>Copies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className='overflow-x-auto'>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead className='text-right'>Copies</TableHead>
            <TableHead className='text-center'>Available</TableHead>
            <TableHead className='text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading || isFetching
            ? Array.from({ length: perPage }).map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className='h-4 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : currentPageBooks.map((book) => (
                <TableRow key={book._id}>
                  <TableCell className='font-medium'>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell className='text-right'>{book.copies}</TableCell>
                  <TableCell className='text-center'>
                    {book.available ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className='flex flex-wrap justify-center gap-2'>
                    <Button asChild size='sm'>
                      <Link to={`/books/${book._id}`}>Borrow</Link>
                    </Button>

                    <Dialog
                      open={selected?._id === book._id}
                      onOpenChange={(open) => !open && setSelected(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => openEdit(book)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[480px]'>
                        <DialogHeader>
                          <DialogTitle>Edit “{selected?.title}”</DialogTitle>
                          <DialogDescription>
                            Update fields and press Save.
                          </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                          <Input
                            placeholder='Title'
                            value={form.title}
                            onChange={(e) =>
                              setForm({ ...form, title: e.target.value })
                            }
                          />
                          <Input
                            placeholder='Author'
                            value={form.author}
                            onChange={(e) =>
                              setForm({ ...form, author: e.target.value })
                            }
                          />
                          <Input
                            placeholder='Genre'
                            value={form.genre}
                            onChange={(e) =>
                              setForm({ ...form, genre: e.target.value })
                            }
                          />
                          <Input
                            placeholder='ISBN'
                            value={form.isbn}
                            onChange={(e) =>
                              setForm({ ...form, isbn: e.target.value })
                            }
                          />
                          <Input
                            type='number'
                            placeholder='Copies'
                            value={form.copies}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                copies: Math.max(0, Number(e.target.value)),
                              })
                            }
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleUpdate}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size='sm' variant='destructive'>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete “{book.title}”?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(book._id)}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <div className='mt-6 flex justify-center gap-2'>
        <Button
          size='sm'
          variant='outline'
          disabled={page === 1}
          onClick={() => dispatch(setPage(page - 1))}
        >
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            size='sm'
            variant={p === page ? "default" : "outline"}
            onClick={() => dispatch(setPage(p))}
          >
            {p}
          </Button>
        ))}
        <Button
          size='sm'
          variant='outline'
          disabled={page === totalPages}
          onClick={() => dispatch(setPage(page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BookList;

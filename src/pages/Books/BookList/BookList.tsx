// ────────────────────────────────────────────
// src/pages/BookList.tsx
// Server‑side pagination + URL‑persistent page, limit & sort
// ────────────────────────────────────────────
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router"; // ← if you use react‑router‑dom, import from that
import { toast } from "sonner";

/* ─── shadcn/ui components ─── */
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
import { Skeleton } from "@/components/ui/skeleton";

/* ─── RTK Query & types ─── */
import {
  useGetBooksQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from "@/redux/api/libraryApi";
import { type IBook, type ISort } from "@/redux/api/types";

/* ─── Redux / filters slice ─── */
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setPage,
  setPerPage,
  setSortBy,
  type SortBy,
} from "@/redux/slices/bookListFiltersSlice";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─────────────────────────────────────────── */

const BookList = () => {
  /* global  */
  const dispatch = useAppDispatch();
  const { perPage, sortBy, page } = useAppSelector((s) => s.bookListFilters);

  /* URL <‑‑> Redux sync */
  const [searchParams, setSearchParams] = useSearchParams();

  /* 1️⃣  Bootstrap Redux slice from URL once */
  useEffect(() => {
    const initialPage = Number(searchParams.get("page")) || 1;
    const initialLimit = Number(searchParams.get("limit")) || 10;
    const initialSort = (searchParams.get("sort") as SortBy) || "title";

    dispatch(setPage(initialPage));
    dispatch(setPerPage(initialLimit));
    dispatch(setSortBy(initialSort));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 2️⃣  Write Redux values back to URL whenever they change */
  useEffect(() => {
    setSearchParams(
      {
        page: String(page),
        limit: String(perPage),
        sort: sortBy,
      },
      { replace: true }
    );
  }, [page, perPage, sortBy, setSearchParams]);

  /* Query server for the current slice */
  const {
    data: booksPayload,
    isLoading,
    isError,
    isFetching,
  } = useGetBooksQuery(
    { page, limit: perPage, sort: sortBy as ISort["sort"] },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      pollingInterval: 60_000,
    }
  );

  /* books + pagination meta */
  const books = useMemo(() => booksPayload?.books ?? [], [booksPayload]);
  const meta = booksPayload?.meta; // { page, limit, total }
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1;

  /* Optional client‑side sort (current slice only) */
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

  /* toast on fetch error */
  useEffect(() => {
    if (isError) {
      toast.error("Couldn’t fetch books", {
        description: "Check your connection and try again.",
      });
    }
  }, [isError]);

  /* mutations */
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  /* local edit dialog state */
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

  /* Skeleton rows while loading */
  const skeletonRows = Array.from({ length: perPage }).map((_, i) => (
    <TableRow key={`loading-${i}`}>
      {Array.from({ length: 7 }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className='h-4 w-full' />
        </TableCell>
      ))}
    </TableRow>
  ));

  /* ────────────────── UI ────────────────── */

  return (
    <div className='container mx-auto px-4 py-10'>
      <h2 className='mb-6 text-2xl font-bold'>Books</h2>

      {/* Filter bar */}
      <div className='mb-4 flex flex-wrap items-center gap-4'>
        <Select
          value={String(perPage)}
          onValueChange={(v) => dispatch(setPerPage(Number(v)))}
        >
          <SelectTrigger className='w-30'>
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
          <SelectTrigger className='w-35'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='title'>Title</SelectItem>
            <SelectItem value='author'>Author</SelectItem>
            <SelectItem value='copies'>Copies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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
            ? skeletonRows
            : sortedBooks.map((book) => (
                <TableRow key={book?._id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableCell className='max-w-50 truncate'>
                        {book?.title.length > 25
                          ? `${book?.title.slice(0, 25)}...`
                          : `${book?.title}`}
                      </TableCell>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{book?.title}</span>
                    </TooltipContent>
                  </Tooltip>
                  <TableCell>{book?.author}</TableCell>
                  <TableCell>{book?.genre}</TableCell>
                  <TableCell>{book?.isbn}</TableCell>
                  <TableCell className='text-right'>{book.copies}</TableCell>
                  <TableCell className='text-center'>
                    {book?.available ? "✅" : "❌"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className='flex flex-wrap justify-center gap-2'>
                    {/* Borrow link */}
                    <Button asChild size='sm'>
                      <Link to={`/books/${book?._id}`}>View/Borrow</Link>
                    </Button>

                    {/* Edit dialog */}
                    <Dialog
                      open={selected?._id === book?._id}
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

                      <DialogContent className='sm:max-w-120 max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                          <DialogTitle>Edit “{selected?.title}”</DialogTitle>
                          <DialogDescription>
                            Update fields and press Save.
                          </DialogDescription>
                          <DialogDescription>
                            <span>Press ESC to Close</span>
                          </DialogDescription>
                        </DialogHeader>

                        {/* Form */}
                        <div className='grid sm:gap-4 gap-2 sm:py-4 py-2'>
                          <Label htmlFor='title'>Book Title</Label>
                          <Input
                            placeholder='Title'
                            value={form.title}
                            onChange={(e) =>
                              setForm({ ...form, title: e.target.value })
                            }
                          />
                          <Label htmlFor='author'>Author's Name</Label>
                          <Input
                            placeholder='Author'
                            value={form.author}
                            onChange={(e) =>
                              setForm({ ...form, author: e.target.value })
                            }
                          />
                          <Label htmlFor='genre'>Genre</Label>
                          <Input
                            placeholder='Genre'
                            value={form.genre}
                            onChange={(e) =>
                              setForm({ ...form, genre: e.target.value })
                            }
                          />
                          <Label htmlFor='isbn'>ISBN</Label>
                          <Input
                            placeholder='ISBN'
                            value={form.isbn}
                            onChange={(e) =>
                              setForm({ ...form, isbn: e.target.value })
                            }
                          />
                          <Label htmlFor='copies'>Copies Available</Label>
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

                    {/* Delete confirm */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size='sm' variant='destructive'>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete “{book?.title}”?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(book?._id)}
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

      {/* Paginator */}
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

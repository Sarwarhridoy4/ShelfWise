// src/pages/BookList.tsx
import { useMemo, useState } from "react";
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

/*───────────────────────────────────────────────────────────
 *  Dummy data (15 books) & type
 *───────────────────────────────────────────────────────────*/
type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  copies: number;
};

const initialBooks: Book[] = [
  {
    _id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "TECHNICAL",
    isbn: "9780132350884",
    copies: 7,
  },
  {
    _id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "SELF‑HELP",
    isbn: "9780735211292",
    copies: 4,
  },
  {
    _id: "3",
    title: "1984",
    author: "George Orwell",
    genre: "FICTION",
    isbn: "9780451524935",
    copies: 3,
  },
  {
    _id: "4",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "TECHNICAL",
    isbn: "9780201616224",
    copies: 5,
  },
  {
    _id: "5",
    title: "Deep Work",
    author: "Cal Newport",
    genre: "SELF‑HELP",
    isbn: "9781455586691",
    copies: 6,
  },
  {
    _id: "6",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "NON‑FICTION",
    isbn: "9780062316097",
    copies: 8,
  },
  {
    _id: "7",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "NON‑FICTION",
    isbn: "9780374533557",
    copies: 2,
  },
  {
    _id: "8",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "FICTION",
    isbn: "9780061120084",
    copies: 4,
  },
  {
    _id: "9",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "FICTION",
    isbn: "9780743273565",
    copies: 1,
  },
  {
    _id: "10",
    title: "Refactoring",
    author: "Martin Fowler",
    genre: "TECHNICAL",
    isbn: "9780134757599",
    copies: 5,
  },
  {
    _id: "11",
    title: "Grit",
    author: "Angela Duckworth",
    genre: "SELF‑HELP",
    isbn: "9781501111112",
    copies: 7,
  },
  {
    _id: "12",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "FICTION",
    isbn: "9780061122415",
    copies: 6,
  },
  {
    _id: "13",
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    genre: "TECHNICAL",
    isbn: "9780984782857",
    copies: 9,
  },
  {
    _id: "14",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    genre: "NON‑FICTION",
    isbn: "9780807014271",
    copies: 3,
  },
  {
    _id: "15",
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "BUSINESS",
    isbn: "9780804139298",
    copies: 4,
  },
];

/*───────────────────────────────────────────────────────────
 *  Component
 *───────────────────────────────────────────────────────────*/
const BookList = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  /* Edit dialog */
  const [selected, setSelected] = useState<Book | null>(null);
  const [form, setForm] = useState<Omit<Book, "_id">>({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    copies: 0,
  });

  /* Pagination & sorting */
  const [perPage, setPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<"title" | "author" | "copies">("title");
  const [page, setPage] = useState(1);

  /* Sort + paginate */
  const sortedBooks = useMemo(
    () =>
      [...books].sort((a, b) => {
        if (sortBy === "copies") return b.copies - a.copies;
        return a[sortBy].localeCompare(b[sortBy]);
      }),
    [books, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / perPage));
  const currentPageBooks = sortedBooks.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* Helpers */
  const openEdit = (book: Book) => {
    setSelected(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      copies: book.copies,
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    setBooks((prev) =>
      prev.map((b) => (b._id === selected._id ? { ...selected, ...form } : b))
    );
    setSelected(null);
  };

  const handleDelete = (id: string) =>
    setBooks((prev) => prev.filter((b) => b._id !== id));

  /* Render */
  return (
    <div className='container mx-auto px-4 py-10'>
      <h2 className='mb-6 text-2xl font-bold'>Books</h2>

      {/* Controls */}
      <div className='mb-4 flex flex-wrap gap-4 items-center'>
        <Select
          value={String(perPage)}
          onValueChange={(v) => {
            setPerPage(Number(v));
            setPage(1);
          }}
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
          onValueChange={(v) => {
            setSortBy(v as "title" | "author" | "copies");
            setPage(1);
          }}
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
          {currentPageBooks.map((book) => (
            <TableRow key={book._id}>
              <TableCell className='font-medium'>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell className='text-right'>{book.copies}</TableCell>
              <TableCell className='text-center'>
                {book.copies > 0 ? "✅" : "❌"}
              </TableCell>

              {/* Actions */}
              <TableCell className='flex flex-wrap justify-center gap-2'>
                {/* Borrow Link */}
                <Button asChild size='sm'>
                  <Link to={`/books/${book._id}`}>Borrow</Link>
                </Button>

                {/* Edit Dialog */}
                <Dialog
                  open={selected?._id === book._id}
                  onOpenChange={(o) => !o && setSelected(null)}
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
                          setForm({ ...form, copies: Number(e.target.value) })
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

                {/* Delete Dialog */}
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
                      <AlertDialogAction onClick={() => handleDelete(book._id)}>
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

      {/* Pagination */}
      <div className='mt-6 flex justify-center gap-2'>
        <Button
          size='sm'
          variant='outline'
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            size='sm'
            variant={p === page ? "default" : "outline"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          size='sm'
          variant='outline'
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BookList;

import { Filter, Search } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAppSelector } from '@/hooks/use-store';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from './ui/sheet';

export function NavBar() {
  const navigate = useNavigate();
  const { search, categories } = useSearch({ from: '/' });

  const { data: threads, status } = useAppSelector((state) => state.thread);

  const uniqueCategories = [
    ...new Set((threads ?? []).map((t) => t.category).filter(Boolean)),
  ].sort();

  const selectedCategories = categories ?? [];
  const hasActiveFilter = selectedCategories.length > 0;

  function toggleCategory(cat: string) {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    navigate({
      to: '/',
      search: (prev) => ({
        ...prev,
        categories: next.length ? next : undefined,
      }),
    });
  }

  function clearCategories() {
    navigate({
      to: '/',
      search: (prev) => ({ ...prev, categories: undefined }),
    });
  }

  const filteredThreads = threads?.filter((thread) => {
    const matchesSearch = thread.title
      .toLowerCase()
      .includes(search?.toLowerCase() ?? '');
    const matchesCategory = categories
      ? categories.includes(thread.category)
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <nav className="flex items-center justify-between gap-2 bg-primary p-4 text-primary-foreground">
      {/* Filter sheet */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              size="icon"
              aria-label="Filter kategori"
              variant="ghost"
              className="relative shrink-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            />
          }
        >
          <Filter />
          {hasActiveFilter && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {selectedCategories.length}
            </span>
          )}
        </SheetTrigger>

        <SheetContent side="bottom" className="max-h-[60vh]">
          <SheetHeader>
            <SheetTitle>Filter Kategori</SheetTitle>
          </SheetHeader>

          <div className="flex flex-wrap gap-2 px-4 py-2">
            {uniqueCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada kategori.
              </p>
            ) : (
              uniqueCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant={
                    selectedCategories.includes(cat) ? 'default' : 'outline'
                  }
                  className="cursor-pointer text-sm select-none"
                  onClick={() => toggleCategory(cat)}
                >
                  #{cat}
                </Badge>
              ))
            )}
          </div>

          {hasActiveFilter && (
            <SheetFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearCategories()}
              >
                Hapus Filter
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Search bar */}
      <InputGroup className="w-full max-w-xs min-w-0 sm:max-w-sm">
        <InputGroupInput
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            navigate({
              to: '/',
              search: (prev) => ({
                ...prev,
                search: e.target.value || undefined,
              }),
            })
          }
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end" className="hidden sm:flex">
          {status === 'success'
            ? `${filteredThreads?.length ?? 0} dari ${threads?.length ?? 0} thread`
            : 'Memuat...'}
        </InputGroupAddon>
      </InputGroup>

      <h1 className="hidden shrink-0 text-xl font-bold sm:block">Forums App</h1>
    </nav>
  );
}

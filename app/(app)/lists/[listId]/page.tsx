import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import AddToListSearch from '@/components/AddToListSearch';
import ListItemRow from '@/components/ListItemRow';

export default async function ListDetailPage({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const userId = await requireUserId();

  const list = await getDb().mediaList.findUnique({
    where: { id: listId },
    include: { items: { include: { mediaItem: true }, orderBy: { position: 'asc' } } },
  });

  if (!list) {
    notFound();
  }

  const isOwner = list.creatorId === userId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{list.title}</h1>
      {list.description && <p className="mt-1 text-slate-500 dark:text-slate-400">{list.description}</p>}

      <div className="mt-6 space-y-2">
        {list.items.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">
            This list is empty.{isOwner ? ' Add something below.' : ''}
          </p>
        )}
        {list.items.map((item, index) => (
          <ListItemRow
            key={item.id}
            item={item}
            index={index}
            mediaListId={list.id}
            isRanked={list.isRanked}
            canEdit={isOwner}
            isFirst={index === 0}
            isLast={index === list.items.length - 1}
          />
        ))}
      </div>

      {isOwner && (
        <div className="mt-8">
          <AddToListSearch mediaListId={list.id} />
        </div>
      )}
    </div>
  );
}

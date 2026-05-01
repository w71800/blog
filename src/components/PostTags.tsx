import TagPill from './TagPill';

type PostTagsProps = {
  tags: string[];
}

const PostTags = ({ tags }: PostTagsProps) => {
  return (
    <div className="flex items-center gap-2">
      {tags.map((tag) => <TagPill label={tag} href={tag}/>)}
    </div>
  )
}

export default PostTags;
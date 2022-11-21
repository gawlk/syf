import Button from '/src/components/button'
import ButtonDivider from '/src/components/buttonDivider'
import Link from '/src/components/link'

interface Props extends SolidJS.ParentProps {
  asset: Asset
  onRemove: () => void
}

export default (props: Props) => {
  return (
    <div class="sortable flex">
      <Button
        icon={IconTablerDragDrop}
        transparent
        class="handle !cursor-move rounded-r-none"
        rgb={props.asset.rgb}
      />
      <ButtonDivider rgb={props.asset.rgb} />
      <Link
        href={props.asset.url}
        leftIcon={props.asset.icon}
        full
        transparent
        rounded={false}
        rgb={props.asset.rgb}
      >
        {props.children}
      </Link>
      <ButtonDivider rgb={props.asset.rgb} />
      <Button
        icon={IconTablerTrash}
        transparent
        class="rounded-l-none"
        rgb={props.asset.rgb}
        onClick={props.onRemove}
      />
    </div>
  )
}

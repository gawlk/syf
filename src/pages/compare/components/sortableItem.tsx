import Button from '/src/components/button'
import Link from '/src/components/link'

import ButtonDivider from './buttonDivider'

import { convertIDToBackgroundColorProperty } from '/src/scripts'

interface Props extends SolidJS.ParentProps {
  id: string
  icon: string
  onRemove: () => void
}

export default (props: Props) => {
  const backgroundColor = convertIDToBackgroundColorProperty(props.id)

  return (
    <div class="sortable flex">
      <Button
        svg={IconTablerDragDrop}
        transparent
        class="handle !cursor-move rounded-r-none hover:brightness-90"
        style={backgroundColor}
      />
      <ButtonDivider backgroundColor={backgroundColor} />
      <Link
        href={`/assets/crypto/${props.id}`}
        leftSrc={props.icon}
        rightSvg={IconTablerArrowRight}
        full
        transparent
        rounded={false}
        class="rounded-r-none hover:brightness-90"
        style={backgroundColor}
      >
        {props.children}
      </Link>
      <ButtonDivider backgroundColor={backgroundColor} />
      <Button
        svg={IconTablerTrash}
        transparent
        class="rounded-l-none hover:brightness-90"
        style={backgroundColor}
        onClick={props.onRemove}
      />
    </div>
  )
}

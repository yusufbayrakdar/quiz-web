import { useRouter } from "next/router";
import styled from "styled-components";

import ShapeForm from "../../components/ShapeForm";

function ShapeCreate() {
  const router = useRouter();
  const query = router.query;
  const isCreate = query.id === "create";
  const _id = isCreate ? null : query.id;
  return (
    <Styled className="center">
      <ShapeForm _id={_id} />
    </Styled>
  );
}

const Styled = styled.div`
  width: 100%;
`;

export default ShapeCreate;

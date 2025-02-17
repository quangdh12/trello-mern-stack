import { styled } from '@mui/material';

const HiddenInputStyled = styled('input')({
    display: 'none',
});

const VisuallyHiddenInput = (props) => {
    return <HiddenInputStyled {...props} />;
};

export default VisuallyHiddenInput;

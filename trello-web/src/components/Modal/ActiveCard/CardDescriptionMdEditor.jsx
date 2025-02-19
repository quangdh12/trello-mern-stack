import EditNoteIcon from '@mui/icons-material/EditNote';
import { Box, Button, useColorScheme } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';


const CardDescriptionMdEditor = ({ description, onUpdateDescription }) => {
    const { mode } = useColorScheme();

    const [markdownEditMode, setMarkdownEditMode] = useState(false);
    const [cardDescription, setCardDescription] = useState(description);

    const handleUpdateCardDescription = () => {
        setMarkdownEditMode(false);

        onUpdateDescription(cardDescription)
    };

    return (
        <Box sx={{ mt: -4 }}>
            {markdownEditMode ? (
                <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box data-color-mode={mode}>
                        <MDEditor
                            value={cardDescription}
                            onChange={setCardDescription}
                            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                            height={400}
                            preview="edit"
                        />
                    </Box>
                    <Button
                        sx={{ alignSelf: 'flex-end' }}
                        onClick={handleUpdateCardDescription}
                        className="interceptor-loading"
                        type="button"
                        variant="contained"
                        size="small"
                        color="info"
                    >
                        Save
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        sx={{ alignSelf: 'flex-end' }}
                        onClick={() => setMarkdownEditMode(true)}
                        type="button"
                        variant="contained"
                        color="info"
                        size="small"
                        startIcon={<EditNoteIcon />}
                    >
                        Edit
                    </Button>
                    <Box data-color-mode={mode}>
                        <MDEditor.Markdown
                            source={cardDescription}
                            style={{
                                whiteSpace: 'pre-wrap',
                                padding: cardDescription ? '10px' : 0,
                                border: cardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                                borderRadius: '8px',
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default CardDescriptionMdEditor;

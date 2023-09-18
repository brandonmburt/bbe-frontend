import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export function CardComp(props) {

  return (
    <Card sx={{ flexGrow: 1, minWidth: 100, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', borderRadius: '5px', padding: '20px' }}>
        <CardContent sx={{padding: '10px'}}>
            {props.title &&
                <Typography variant="h5" component="div" sx={{ marginBottom: '20px' }}>
                    {props.title}
                </Typography>
            }

            {props.body &&
                <Typography component={'div'} variant="body2">
                    {props.body}
                </Typography>
            }
        </CardContent>
        
        {props.button && // TODO: link to props.button.link
            <CardActions>
                <Button size="small">{props.button.text}</Button>
            </CardActions>
        }
    </Card>
  );
}
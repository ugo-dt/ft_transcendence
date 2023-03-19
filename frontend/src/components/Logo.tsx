import SportsTennisIcon from "@mui/icons-material/SportsTennis";

interface LogoProps {
  color?: string | undefined,
  fontSize?: 'inherit' | 'large' | 'medium' | 'small',
}

const Logo = ({color, fontSize = 'inherit'}: LogoProps): JSX.Element => {
  return (
    <SportsTennisIcon
      htmlColor={color}
      fontSize={fontSize}
    />
  );
}

export default Logo;
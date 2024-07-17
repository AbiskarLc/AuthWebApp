import { Html, Head,Preview,Heading,Row,Section,Text, } from "@react-email/components";


interface VerificationEmailProps {
    username: string,
    otp: string
}


const VerificationEmail  = ({username,otp}:VerificationEmailProps) => {


    return(
        <Html lang="en" dir="ltr">
            <Head>
                <title>Email Verification</title>
            </Head>
            <Preview>
                Your otp verification code is : {otp}
            </Preview>
            <Section>
                <Row>
                    <Heading>Hello {username},</Heading>
                 </Row>   
                 <Row>
                    <Text>Thank you for registering. Please use the following registration code to complete your verification code</Text>
                 </Row>
                 <Row>
                    <Text>
                        Your otp code is : {otp}
                    </Text>
                 </Row>
            </Section>
      </Html>
    )

}


export default VerificationEmail;
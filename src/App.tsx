import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
});

export type FormData = z.infer<typeof schema>;

const App = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const onSubmit: SubmitHandler<FormData> = data => {
    console.log(data);
  };

  return (
    <Box maxW="md" mx="auto" mt="10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.name} mb="4">
              <FormLabel htmlFor="name">名前</FormLabel>
              <Input id="name" {...field} />
              <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.email} mb="4">
              <FormLabel htmlFor="email">メールアドレス</FormLabel>
              <Input id="email" {...field} />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.password} mb="4">
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <Input id="password" type="password" {...field} />
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Button mt="4" colorScheme="teal" type="submit">送信</Button>
      </form>
    </Box>
  );
};

export default App;

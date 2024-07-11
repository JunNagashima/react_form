import { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Select, Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';
import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  role: z.enum(['admin', 'user', 'guest'], { required_error: '役割を選択してください' }),
  preferences: z.array(z.string()).nonempty('少なくとも1つの好みを選択してください'),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: '有効な開始日を入力してください' }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: '有効な終了日を入力してください' })
}).refine(data => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate >= startDate;
}, {
  message: '終了日は開始日より後の日付にしてください',
  path: ['endDate']
});

export type FormData = z.infer<typeof schema>;

const preferenceOptions = [
  { value: 'sports', label: 'スポーツ' },
  { value: 'music', label: '音楽' },
  { value: 'movies', label: '映画' }
];

const App = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      preferences: [],
      startDate: '',
      endDate: ''
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

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.role} mb="4">
              <FormLabel htmlFor="role">役割</FormLabel>
              <Select id="role" {...field}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </Select>
              <FormErrorMessage>{errors.role && errors.role.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <FormControl isInvalid={!!errors.preferences} mb="4">
          <FormLabel>好み</FormLabel>
          <Controller
            name="preferences"
            control={control}
            render={({ field }) => (
              <Stack spacing={2} direction="column">
                {preferenceOptions.map(option =>
                  <Checkbox id={option.value} value={option.value} key={option.value} onChange={(e) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      field.onChange([...field.value, value]);
                    } else {
                      field.onChange(field.value.filter((v: string) => v !== value));
                    }
                  }} isChecked={field.value.includes(option.value)}>{option.label}</Checkbox>)}
              </Stack>
            )}
          />
          <FormErrorMessage>{errors.preferences && errors.preferences.message}</FormErrorMessage>
        </FormControl>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.startDate} mb="4">
              <FormLabel htmlFor="startDate">開始日</FormLabel>
              <Input id="startDate" type="date" {...field} />
              <FormErrorMessage>{errors.startDate && errors.startDate.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.endDate} mb="4">
              <FormLabel htmlFor="endDate">終了日</FormLabel>
              <Input id="endDate" type="date" {...field} />
              <FormErrorMessage>{errors.endDate && errors.endDate.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Button mt="4" colorScheme="teal" type="submit">送信</Button>
      </form>
    </Box>
  );
};

export default App;

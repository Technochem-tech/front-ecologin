
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';

const cardFormSchema = z.object({
  cardNumber: z.string()
    .min(16, "Número do cartão deve ter pelo menos 16 dígitos")
    .max(19, "Número do cartão não pode exceder 19 dígitos"),
  cardHolder: z.string().min(3, "Nome do titular é obrigatório"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Data de validade deve estar no formato MM/AA"),
  cvv: z.string().min(3, "CVV deve ter pelo menos 3 dígitos").max(4, "CVV não pode exceder 4 dígitos"),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface CardFormProps {
  onSubmit: (values: CardFormValues) => void;
}

const CardForm: React.FC<CardFormProps> = ({ onSubmit }) => {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center mb-2">
          <div className="h-10 w-10 bg-eco-green-100 rounded-full flex items-center justify-center text-eco-green-600 mr-3">
            <CreditCard className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Adicionar Cartão</h2>
        </div>

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Cartão</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0000 0000 0000 0000" 
                  {...field} 
                  onChange={(e) => {
                    // Format the card number with spaces
                    const value = e.target.value.replace(/\s/g, '');
                    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                    field.onChange(formattedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Titular</FormLabel>
              <FormControl>
                <Input placeholder="Nome como consta no cartão" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/AA" 
                    {...field} 
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^\d]/g, '');
                      if (value.length <= 2) {
                        field.onChange(value);
                      } else if (value.length <= 4) {
                        field.onChange(`${value.slice(0, 2)}/${value.slice(2)}`);
                      }
                    }}
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123" 
                    type="password" 
                    {...field} 
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-eco-green-600 hover:bg-eco-green-700 mt-4"
        >
          Adicionar Cartão
        </Button>
      </form>
    </Form>
  );
};

export default CardForm;

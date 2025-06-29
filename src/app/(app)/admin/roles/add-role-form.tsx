
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const addRoleSchema = z.object({
  name: z.string().min(1, "Role name is required.") as z.ZodSchema<'Admin' | 'Sales Manager' | 'Sales Rep'>,
  description: z.string().min(1, "Description is required."),
});

export type AddRoleFormValues = z.infer<typeof addRoleSchema>;

export function AddRoleForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddRoleFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      name: undefined,
      description: "",
    },
  });

  const onSubmit = (values: AddRoleFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Marketing Lead" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the role's permissions and responsibilities." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Role</Button>
        </div>
      </form>
    </Form>
  );
}

    